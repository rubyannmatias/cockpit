# cockpit README

**cockpit** is a VSCode Extension that leverages OpenAI API search capabilities, specifically chat completion, for the purpose of answering the developer user's questions without leaving the IDE. To activate it, run the command **Welcome Message**.

Afterward, run the command **Configure** to store or update the OpenAI API key you will need to access its services. Otherwise, if you are simply running the repository in development mode, just add a `.env` file like the `.env.example` provided locally.

Based on the running machine's platform and environment information that it provides to OpenAI, it can **Find [the] Shell Command** you are looking for even if you just input natural language from within your IDE. It allows you to run the command found right after or first copy it to clipboard.

It also offers a separate command for you to **Ask Anything** from OpenAI, be it random questions or explanation for the shell command you have gotten. You can ask it step-by-step guides for anything and it will pipe the output for you to a temporary text file, which it also immediately opens for you.

It offers persistence of up to the last five (5) of your previous searches, per each category (shell or anything), so that you can just **Show Search History** and run the same search without typing again. For now, it can support English and German via VSCode Configure Display Langugage.

## Features

| Extension Command | Purpose |
| ----- | ----- |
| Cockpit - Welcome Message | Activates the VSCode Extension |
| Cockpit - Configure | Opens an input box for user to store or update OpenAI API key in SecretStorage |
| Cockpit - Find Shell Command | Opens an input box for user to input natural language to give OpenAI context on the shell command user is looking for |
| Cockpit - Ask Anything | Opens an input box for user to find answers for random questions |
| Cockpit - Show Search History | Opens a select dropdown first to ask user which category of previous searches to show, and on selection, it shows the user another dropdown to select previous search terms used. |

## Requirements

VSCode version at least 1.81.0

## Extension Settings

Not applicable for now.

## Known Issues

Please do open an issue, thanks.

## Release Notes

### 0.3.0

Initial release of **cockpit**
