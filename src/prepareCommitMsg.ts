import axios from "axios";
import { workspace } from "vscode";

/**
 * Generate commit message.
 *
 * A public wrapper function to allow an existing message to be set.
 *
 * @param diff A string with the entire git diff of all present changes
 */
export async function generateMsg(diff: string): Promise<string> {
  let data = null;
  console.debug("Bearer " + workspace.getConfiguration().get("conf.view.apiKey"));
  try {
    data = await axios({
      method: "post",
      url: "https://api.openai.com/v1/completions",
      headers: {
        Authorization:
          "Bearer " + workspace.getConfiguration().get("conf.view.apiKey"),
      },
      data: {
        model: "text-davinci-003",
        prompt:
          `
          Describe to what has changed in the following code diff. 
          Try to explain the business logic. Don't list all the functions added: \n\n` +
          diff,
        max_tokens: 240,
        temperature: 0,
      },
    });

    console.debug(data.data);
  } catch (e) {
    console.debug(e);
  }
  return data!.data.choices[0].text!.trim();
}
