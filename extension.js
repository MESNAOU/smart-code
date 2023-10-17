
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {

	console.log('Congratulations, your extension "smart-code" is now active!');

	let ed = vscode.window.activeTextEditor;

	let cmd1 = vscode.commands.registerCommand('smart-code.describ', function () {
		describ(ed);
	});

	let cmd2 = vscode.commands.registerCommand('smart-code.refac', function () {
		refac(ed);
	});

	let cmd3 = vscode.commands.registerCommand('smart-code.bug', function () {
		bug(ed);

	});

	let cmd4 = vscode.commands.registerCommand('smart-code.getTest', function () {
		test(ed);
	});

	let cmd5 = vscode.commands.registerCommand('smart-code.comment', function () {
		comment(ed);
	});

	context.subscriptions.push(cmd1,cmd2,cmd3,cmd4,cmd5);
}

// This method is called when your extension is deactivated
function deactivate() {}

/**
 * createNewEditor - displaying a content in a new editor
 * @content: displayed content
 */
async function createNewEditor(content) {
	// Create a new untitled document
	const newDocument = await vscode.workspace.openTextDocument({ content: `${content}` });

	// Show the new document in an editor
	const newEditor = await vscode.window.showTextDocument(newDocument);

	// Save the changes
	await newDocument.save();
}

/**
 * describ - comment the offered description and add the corresponding code 
 * @ed: current editor
 */
function describ(ed){
	if (ed) {
		//the offered description
		let txt = ed.document.getText();
		//to store the responce
		let resp;
		let lang;

		if(txt != ""){
			const OpenAI = require("openai");

			//ask for a key
			vscode.window.showInputBox({
				prompt: "Enter your chat GPT API key",
				placeHolder: "sk-**********************"
			}).then(async (key) =>{
				if (key) {
					try {
						//create connexion with chat GPT
						const openai = new OpenAI({
							apiKey: `${key}`
						});
						//ask for the desired code's language
						vscode.window.showInputBox({
							prompt: "which language do you want to write your code?",
							placeHolder: "******"
						}).then(async (language) =>{
							if(language){
								lang = language.toLowerCase();
							}

							const completion = await openai.chat.completions.create({
								messages: [
									{ role: "user", content: `Please provide me with code writing in ${lang} to` },
									{ role: "user", content: txt },
									{
										role: "user",
										content: `answer me exactly in the following parsable json format:
										{
											"D": "explanation",
											"C": "code with line breaker"
										}
										`
									}
								],
								model: "gpt-3.5-turbo",
							});
							resp = JSON.parse(completion.choices[0].message.content).C;
	
							//display the responce
							ed.edit(editBuilder => {
								//place to open the comment 
								let symst;
								//place to end comment
								let symend;
	
								//choose the comment's symboles according to the language
								if(lang == "html"){
									symst = "<!--";
									symend="-->"
								}else if(lang == "python"){
									symst = "'''";
									symend = "'''"
								}else{
									symst="/*";
									symend="*/"
								}
	
								//comment each lign for "R" and shell
								if(lang == "r" || lang == "shell"){
									//get first line
									let i = 0;
									let rg = new vscode.Range(i, 0, i, 0);
	
									//iterate for each line
									while(i<ed.document.lineCount){
										editBuilder.replace(rg, '#');
										i++;
										rg = new vscode.Range(i, 0, i, 0);
									}
	
									//add the code
									editBuilder.replace(rg, `\n${resp}\n`);
								}else{
									//get the start of the editor
									const rg1 = new vscode.Range(0, 0, 0, 0);
									//get the end of the description
									let rg2 = new vscode.Range(ed.document.lineCount , 0, ed.document.lineCount , 0);
	
									// start a comment
									editBuilder.replace(rg2, `\n${symend}\n${resp}\n`);
									//add the code
									editBuilder.replace(rg1, `${symst}\n`);
								}
							});
						})
						
					} catch (error) {
						//incorrect key
						vscode.window.showErrorMessage('Your API key is incorrect or expired.Please retry.');
						return describ(ed);
					}
				} else {
					// User canceled the input
					vscode.window.showWarningMessage("The extension is canceled.");
				}
			})
			
		}
	}
}

/**
 * refac - refactor the offred code 
 * @ed: current editor
 */
function refac(ed) {

	if (ed) {
		//get the offered code
		let txt = ed.document.getText();
		//to store the responce
		let resp;

		if(txt != ""){
			const OpenAI = require("openai");
			
			//ask for a key
			vscode.window.showInputBox({
				prompt: "Enter your chat GPT API key",
				placeHolder: "sk-**********************"
			}).then(async (key) =>{
				if (key) {
					try {
						//create connexion with chat GPT
						const openai = new OpenAI({
							apiKey: `${key}`
						});
						const completion = await openai.chat.completions.create({
							messages: [
								{ role: "user", content: "Please provide me with code to refactor this code:" },
								{ role: "user", content: txt },
								{
									role: "user",
									content: `answer me exactly in the following parsable json format:
									{
										"D": explanation,
										"C": code
									}
									`
								}
							],
							model: "gpt-3.5-turbo",
						});
						resp = JSON.parse(completion.choices[0].message.content).C;
						
						//display the responce
						ed.edit(editBuilder => {
							// get the editor
							let rg = new vscode.Range(0, 0, ed.document.lineCount, 0);
				
							// overwrite the code with the responce
							editBuilder.replace(rg, `${resp}`);
						});
					} catch (error) {
						vscode.window.showErrorMessage('Your API key is incorrect or expired.Please retry.');
						return refac(ed);
					}
				} else {
					// User canceled the input
					vscode.window.showWarningMessage("The extension is canceled.");
				}
			})
		}
	}
}

/**
 * bug - debug the offred code 
 * @ed: current editor
 */
function bug(ed){
	if (ed) {
		let txt = ed.document.getText();
		//to store the responce
		let resp;

		if(txt != ""){
			const OpenAI = require("openai");
			
			//ask for a key
			vscode.window.showInputBox({
				prompt: "Enter your chat GPT API key",
				placeHolder: "sk-**********************"
			}).then(async (key) =>{
				if (key) {
					try {
						//create connexion with chat GPT
						const openai = new OpenAI({
							apiKey: `${key}`
						});
						const completion = await openai.chat.completions.create({
							messages: [
								{ role: "user", content: "Please provide me with code to fix existing bugs in this code:" },
								{ role: "user", content: txt },
								{
									role: "user",
									content: `answer me exactly in the following parsable json format:
									{
										"D": explanation,
										"C": code
									}
									`
								}
							],
							model: "gpt-3.5-turbo",
						});
						resp = JSON.parse(completion.choices[0].message.content).C;
						
						//display the responce
						ed.edit(editBuilder => {
							// get the editor
							let rg = new vscode.Range(0, 0, ed.document.lineCount, 0);

							// overwrite the code with the responce
							editBuilder.replace(rg, `${resp}`);
						});
					} catch (error) {
						vscode.window.showErrorMessage('Your API key is incorrect or expired.Please retry.');
						return bug(ed);
					}
				} else {
					// User canceled the input
					vscode.window.showWarningMessage("The extension is canceled.");
				}
			})
		}
	}
}

/**
 * test - generate unit tests in a new editor
 * @ed: current editor
 */
function test(ed) {
	if (ed) {
		let txt = ed.document.getText();
		//to store the responce
		let resp;

		if(txt != ""){
			const OpenAI = require("openai");
			
			//ask for a key
			vscode.window.showInputBox({
				prompt: "Enter your chat GPT API key",
				placeHolder: "sk-**********************"
			}).then(async (key) =>{
				if (key) {
					try {
						//create connexion with chat GPT
						const openai = new OpenAI({
							apiKey: `${key}`
						});
						const completion = await openai.chat.completions.create({
							messages: [
								{ role: "user", content: "generate unit tests for this code:" },
								{ role: "user", content: txt }
							],
							model: "gpt-3.5-turbo",
						});
						resp = completion.choices[0].message.content;
						
						//display the responce in a new editor
						createNewEditor(resp);
					} catch (error) {
						vscode.window.showErrorMessage('Your API key is incorrect or expired.Please retry.');
						return test(ed);
					}
				} else {
					// User canceled the input
					vscode.window.showWarningMessage("The extension is canceled.");
				}
			})
		}
	}
}

/**
 * bug - comment the offred code 
 * @ed: current editor
 */
function comment(ed) {

	if (ed) {
		let txt = ed.document.getText();
		//to store the responce
		let resp;

		if(txt != ""){
			const OpenAI = require("openai");
			
			//ask for a key
			vscode.window.showInputBox({
				prompt: "Enter your chat GPT API key",
				placeHolder: "sk-**********************"
			}).then(async (key) =>{
				if (key) {
					try {
						//create connexion with chat GPT
						const openai = new OpenAI({
							apiKey: `${key}`
						});
						const completion = await openai.chat.completions.create({
							messages: [
								{ role: "user", content: "comment this code:" },
								{ role: "user", content: txt },
								{
									role: "user",
									content: `answer me exactly in the following parsable json format:
									{
										"D": explanation,
										"C": code with comments in it
									}
									`
								}
							],
							model: "gpt-3.5-turbo",
						});
						
						resp = JSON.parse(completion.choices[0].message.content).C;
						
						//display the responce
						ed.edit(editBuilder => {
							// get the editor
							let rg = new vscode.Range(0, 0, ed.document.lineCount, 0);
							
							// overwrite the code with the responce
							editBuilder.replace(rg, `${resp}`);
						});
					} catch (error) {
						vscode.window.showErrorMessage('Your API key is incorrect or expired.Please retry.');
						return comment(ed);
					}
				} else {
					// User canceled the input
					vscode.window.showWarningMessage("The extension is canceled.");
				}
			})
		}
	}
}

module.exports = {
	activate,
	deactivate
}


