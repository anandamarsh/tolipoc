## Introduction

This project was developed in one day (another day of prompting) towards a Hackday. I wanted to answer the question - _Can ChatGPT / OpenAI produce a simple React App without a programmer's help_ The answer is - _Not Yet_

[![Tolipoc Demo](https://img.youtube.com/vi/RioOkFkBO-c/0.jpg)](https://www.youtube.com/watch?v=RioOkFkBO-c)

## The way things work here

The end produce here is a _single-page-app_ that gets created in a `spa` folder. In the beginning, there is no `spa` folder. When you run `start-all.sh`, it first creates a `npx create-react-app` and puts it in the `spa` folder. At the end of this exercise, you can cut this `spa` folder and treat it as a seperate app.

So, after you have your `spa` created by running `start-all.sh`, this script runs this new `spa` on `http://localhost:1978/`. When you launch the tolipoc `client` app on `http://localhost:1980/`, it loads the `spa` app in an _iframe_, and also adds a _chatbot_ to it. When you enter a prompt, this _chatbot_ updates the contents of `spa/src/App.js` file.

To call OpenAI APIs, the `start-all.sh` scripts kicks-off a simple nodejs server that exposes a single endpoint `/api/get-response`. Do this tutorial [OpenAI Developer quickstart](https://platform.openai.com/docs/quickstart?context=node) to set your `OpenAI_API_KEY` first.

`server/app.js` also has an `assistant_id` and `thread_id`, which you need to update (mine wouldnt work for you). When you create an _Assistant_, give something smilar to the following as _instructions_:

````
You will generate React and Material UI code in response to the prompt. Make sure the code is complete, compilable and does not require any external libraries other than mui, icons-material and emotion. output code only. no comments, no formatting, no md, no ``` ... just plain simple code. we will copy / paste the code as is and run it, so, no commentary or explanation. code only. The code should be complete in itself ie, starting from import statements to the end.  Gimme plaintext response, not an md type response that starts with jsx ```. always always end the code with" export default App;"  Your reponse with always only be React code and nothing else. no english langue, just React code.
````

## The way forward

I dont intend to continue working on this codebase (there are many engineers / startups doing that already). It will be obsolete withing a month from now (Mon 12th Aug 2024). If this code helped you, find me on LinkedIn and connect to say Hello.
