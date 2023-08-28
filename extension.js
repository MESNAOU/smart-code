
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


async function createNewEditor(content) {
	// Create a new untitled document
	const newDocument = await vscode.workspace.openTextDocument({ content: `${content}` });

	// Show the new document in an editor
	const newEditor = await vscode.window.showTextDocument(newDocument);

	// Save the changes
	await newDocument.save();
}

function describ(ed){
	if (ed) {

		let txt = ed.document.getText();
		let resp;

		if(txt != ""){

			const OpenAI = require("openai");
			
			vscode.window.showInputBox({
				prompt: "Enter your chat GPT API key",
				placeHolder: "sk-**********************"
			}).then(async (key) =>{
				if (key) {
					try {
						const openai = new OpenAI({
							apiKey: `${key}`
						});
						const completion = await openai.chat.completions.create({
							messages: [
								{ role: "user", content: "générer du code à base de cette description textuelle" },
								{ role: "user", content: txt }
							],
							model: "gpt-3.5-turbo",
						});
						resp = completion.choices[0];

						ed.edit(editBuilder => {
							// Define the range where you want to make changes
							const rg1 = new vscode.Range(0, 0, 0, 0);
							let rg2 = new vscode.Range(ed.document.lineCount , 0, ed.document.lineCount , 0);
							// Replace the selected range with new text
				
							editBuilder.replace(rg2, `\n*/\n${resp}\n`);
							editBuilder.replace(rg1, '/*\n');
						});

					} catch (error) {
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

function refac(ed) {

	if (ed) {
		let txt = ed.document.getText();
		let resp;
		const OpenAI = require("openai");
			
		vscode.window.showInputBox({
			prompt: "Enter your chat GPT API key",
			placeHolder: "sk-**********************"
		}).then(async (key) =>{
			if (key) {
				try {
					const openai = new OpenAI({
						apiKey: `${key}`
					});
					const completion = await openai.chat.completions.create({
						messages: [
							{ role: "user", content: "refactorer ce code" },
							{ role: "user", content: txt }
						],
						model: "gpt-3.5-turbo",
					});
					resp = completion.choices[0];
					ed.edit(editBuilder => {
						// Define the range where you want to make changes
						let rg = new vscode.Range(0, 0, ed.document.lineCount, 0);
						// Replace the selected range with new text
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
function bug(ed){

	if (ed) {
		let txt = ed.document.getText();
		let resp;
		const OpenAI = require("openai");
			
		vscode.window.showInputBox({
			prompt: "Enter your chat GPT API key",
			placeHolder: "sk-**********************"
		}).then(async (key) =>{
			if (key) {
				try {
					const openai = new OpenAI({
						apiKey: `${key}`
					});
					const completion = await openai.chat.completions.create({
						messages: [
							{ role: "user", content: "fixer les bugs existants dans ce code" },
							{ role: "user", content: txt }
						],
						model: "gpt-3.5-turbo",
					});
					resp = completion.choices[0];
					ed.edit(editBuilder => {
						// Define the range where you want to make changes
						let rg = new vscode.Range(0, 0, ed.document.lineCount, 0);
						// Replace the selected range with new text
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

function test(ed) {

	if (ed) {
		let txt = ed.document.getText();
		let resp;
		const OpenAI = require("openai");
			
		vscode.window.showInputBox({
			prompt: "Enter your chat GPT API key",
			placeHolder: "sk-**********************"
		}).then(async (key) =>{
			if (key) {
				try {
					const openai = new OpenAI({
						apiKey: `${key}`
					});
					const completion = await openai.chat.completions.create({
						messages: [
							{ role: "user", content: "générer des tests unitaires pour ce code" },
							{ role: "user", content: txt }
						],
						model: "gpt-3.5-turbo",
					});
					resp = completion.choices[0];
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

function comment(ed) {

	if (ed) {
		let txt = ed.document.getText();
		let resp;
		const OpenAI = require("openai");
			
		vscode.window.showInputBox({
			prompt: "Enter your chat GPT API key",
			placeHolder: "sk-**********************"
		}).then(async (key) =>{
			if (key) {
				try {
					const openai = new OpenAI({
						apiKey: `${key}`
					});
					const completion = await openai.chat.completions.create({
						messages: [
							{ role: "user", content: "commenter ce code" },
							{ role: "user", content: txt }
						],
						model: "gpt-3.5-turbo",
					});
					resp = completion.choices[0];
					ed.edit(editBuilder => {
						// Define the range where you want to make changes
						let rg = new vscode.Range(0, 0, ed.document.lineCount, 0);
						// Replace the selected range with new text
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

module.exports = {
	activate,
	deactivate
}


