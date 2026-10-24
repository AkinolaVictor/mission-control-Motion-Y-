import { article_writter } from "./functions/article_writter"
import { content_publisher } from "./functions/content_publisher"
import { task_cleanup } from "./functions/task_cleanup"
import { url_extractor } from "./functions/url_extractor"
import { url_scrapper } from "./functions/url_scrapper"
import fs from "fs/promises"
import path from "path"


export async function task_runner(data){
    const filePath = path.join(process.cwd(), "agents", "devto_content_creator", "workspace", data.task_id, "task_state.json")
    const file = await fs.readFile(filePath, "utf8")
    const task_state = JSON.parse(file)
    
    // return
    const {status, process_states, await_approval, attempt} = task_state
    const {post_created, url_collection, url_scrapping, published} = process_states || {}

    // const workspaceDir = path.join(process.cwd(), 'agents', 'devto_content_creator', 'workspace', task_id);
    
    // stage 5
    if(post_created === "completed" && url_scrapping === "completed" && url_collection === "completed" && published === "completed"){
        await task_cleanup(task_state)
        console.log("Done: research completed, article generated")
        return
    }
    
    if(status === "completed") return
    if(published === "completed") return
    if(attempt>7) return

    // if(url_collection === "working") return
    // if(url_scrapping === "working") return
    // if(post_created === "working") return
    
    if(
        url_scrapping==="completed" &&
        post_created==="completed" &&
        published==="completed" &&
        url_collection==="completed"
    ) return
    
    if(await_approval) {
        // console.log(task_state)
        // send_request_for_approval(task_state)
        // add to the approval list or simply bring it to the top
        return
    }

    // stage 1
    if(url_collection !== "completed" ){
        await url_extractor(task_state)
        console.log("1/3) url Extraction completed")
        return
    }
    
    // stage 2
    if(url_scrapping !== "completed" && url_collection === "completed"){
        await url_scrapper(task_state)
        console.log("2/3) url Scrapping completed")
        return
    }
    
    // stage 3
    if(post_created !== "completed" && url_scrapping === "completed" ){
        await article_writter(task_state)
        console.log("Done: research completed, article generated")
        return
    }
    
    // // stage 4
    console.log("before pub")
    if(post_created == "completed" && published !== "completed" ){
        console.log("in pub")
        await content_publisher(task_state)
        console.log("Done: research completed, article generated")
        return
    }
}