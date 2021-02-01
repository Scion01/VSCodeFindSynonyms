// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import fetch from 'node-fetch';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "synonyms" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('synonyms.findSyn', async () => {
		const editor:vscode.TextEditor|undefined = vscode.window.activeTextEditor;
		if(editor == undefined){
			vscode.window.showInformationMessage('editor not found!');
			return;
		}
		const text:string|undefined = editor.document.getText(editor.selection);
		if(text == undefined){
			vscode.window.showInformationMessage('No text selected!');
			return;
		}
		const response = await fetch(`https://api.datamuse.com/words?ml=${text.replace(' ','+')}`)
		const data = await response.json();
		const quickPick = vscode.window.createQuickPick();
		quickPick.items = data.map((wordItem:any)=>({label: wordItem['word']}));
		quickPick.onDidChangeSelection((items:any)=>{
			console.log(`selected: ${items[0].label}`);
			quickPick.dispose();
			editor.edit((edit)=>{
				edit.replace(editor.selection,items[0].label);
			})
		});
		quickPick.onDidHide(()=>{
			quickPick.dispose();
		})
		quickPick.show();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
