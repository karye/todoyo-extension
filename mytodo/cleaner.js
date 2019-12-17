const vscode = require("vscode");

class Cleaner {
    clearConsoleLogs() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("Inget öppet dokument!");
            return;
        }

        const doc = editor.document;
        const text = doc.getText();
        const regex = /(console.log\(\)|console.log\(.+\));/;
        text.split("\n").map((codeline, idx) => {
            console.log("Hittat: ", codeline);
            vscode.window.showInformationMessage(codeline);
        });
    }
}

module.exports = Cleaner;