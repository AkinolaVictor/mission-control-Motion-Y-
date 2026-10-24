this function (url_extractor) recieves props task_state containing { task_id, search_prompt } now it has been upgrades to contain { task_id, search_prompt, sub_questions } 

the sub_questions contains an array of question to be properly researched

now, instead of researching only on the search_prompt i want it to search on the both the search_prompt and all the questions in the sub_questions

Output:
currently, after scrapping the urls for the search_prompt, it stores it in a file research_urls.json, this file contains an array of objects, as in: 
[
    {
        id: url_id,
        url: extracted_url
    },
    {
        id: url_id2,
        url: extracted_url
    },
    ...
]

now, since there's a new update, instead of storing an array of objects in the research_urls.json file, i want it to take this format instead:
{
    search_prompt: [url1, url2, url3, ...],
    sub_question_1: [url1, url2, url3, ...],
    sub_question_2: [url1, url2, url3, ...],
    sub_question_3: [url1, url2, url3, ...],
    each_of_the_question: [url1, url2, url3, ...],
    ...
}

preserve the logic: about 7 urls from each data-source, so each array should have many urls in them (about 100+ in total)

here is the code, rewrite it:















Input:
this function (url_scrapper) reads research_urls.json file which contains an array of objects as in:
[
    {
        id: url_id,
        url: extracted_url
    },
    {
        id: url_id2,
        url: extracted_url
    },
    ...
]
it loops through the array and scrapes the content of the webpage one by one,
but now the research_urls.json file has changed it's data structure, it now looks like this:
{
    search_prompt: [url1, url2, url3, ...],
    sub_question_1: [url1, url2, url3, ...],
    sub_question_2: [url1, url2, url3, ...],
    sub_question_3: [url1, url2, url3, ...],
    each_of_the_question: [url1, url2, url3, ...],
    ...
}
so i want you to update the logic to be able to loop through all the url for each question


Output
normally this code stores each extracted url content in a folder called extractions, as in:
extractions:
  -content1.txt
  -content2.txt
  -content3.txt
  ...

Now with the new upgrade, i want it to store the extracted contents in a more sectionalized way, as in:
extractions:
    search_prompt:
        -content1.txt
        -content2.txt
        ...
    sub_question_1:
        -content1.txt
        -content2.txt
        ...
    sub_question_2:
        -content1.txt
        -content2.txt
        ...
    each_of_the_question:
        -content1.txt
        -content2.txt
        ...
  ...

while writing the each of thie content ensure to use this structure:
-each_of_the_question
-url
-title of webpage
-other relevant information
-main content

ensure to preserve other existing logics.
here is the code, rewrite it:





















i created this code to help me in write articles from a long list of document in a folder called extractions, as in:
extractions:
  -content1.txt
  -content2.txt
  -content3.txt
  ...

now, the folder has taken a different structure, which looks like this:
extractions:
    search_prompt:
        -content1.txt
        -content2.txt
        ...
    sub_question_1:
        -content1.txt
        -content2.txt
        ...
    sub_question_2:
        -content1.txt
        -content2.txt
        ...
    each_of_the_question:
        -content1.txt
        -content2.txt
        ...
  ...

i want you to rewrite this code to be able to read all documents in the extractions folder

the puropose of this code is to create a post from all the available dataset, this code would be shared publicly on dev.to social media
since it's no longer for the purpose of creating an article, ensure the post to be generated is ready to be posted on dev.to
return the rewritten version in a place i can copy and paste
here is the code, rewrite it:









i want you to create a function @agents/devto_content_creator/functions/content_publisher.js, that publishes post to dev.to
the api key access for connection is process.env.dev_to_access
this function receives a prop (task_state) which includes {task_id}

it reads the @agents/devto_content_creator/workspace/[task_id]/output/[name_of_content_to_be_published].json

the json file contains an object in this format:
{
    article: {
        title: title of the post,
        description: description,
        body_markdown: body markdown,
        tags: array of tags best to describe the post (max of 4) || [],
        published: false
    }
}

read the @publish_post.js file for example on how to create this function

let me see your plan before starting







instead of this function storing only a [output_name].md file in the .../output/ folder, i want to be able to store both .md and .json file inside the .../output/ folder

the json should be of this format
{
    article: {
        title: title of the post,
        description: description,
        body_markdown: body markdown,
        tags: array of tags best to describe the post (max of 4) || [],
        published: false
    }
}

### Payload Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | The title of the post. |
| `description` | String | Yes | A short summary of the post. |
| `body_markdown` | String | Yes | The main content of the post in Markdown format. |
| `tags` | Array | Yes | An array of strings for tagging the post (e.g., `["javascript", "webdev"]`). |
| `published` | Boolean | No | Whether to publish the post immediately. Defaults to `false` (draft). |

do not remove from the existing features and logic, simply just add this new .json feature
rewrite the function to do so
rewrite it out in a place where i can copy it

here's the code:



