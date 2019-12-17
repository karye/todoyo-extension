const vscode = require("vscode");

class Cleaner {
    clearConsoleLogs() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("Inget öppet dokument!");
            return;
        }

        /* Hämta nuvarande dokument */
        const doc = editor.document;

        let kommentar = [];
        const smallNumberDecorationType = vscode.window.createTextEditorDecorationType({
            backgroundColor: 'pink',
            borderWidth: '1px',
            borderStyle: 'solid',
            overviewRulerColor: 'blue',
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            light: {
                // this color will be used in light color themes
                borderColor: 'red'
            },
            dark: {
                // this color will be used in dark color themes
                borderColor: 'lightblue'
            }
        });

        const text = doc.getText();
        console.log("doc.fileName", doc.fileName);
        console.log("doc.lineCount ", doc.lineCount);
        console.log("doc.lineAt(17) ", doc.lineAt(17).text);

        /* Vi söker efter console.log() */
        const regex = /(console.log\(\)|console.log\(.+\));/;

        /* Gå igenom alla rader */
        for (let i = 0; i < doc.lineCount; i++) {

            /* Plocka ut raden */
            const line = doc.lineAt(i);

            /* Hittat en console.log() */
            if (regex.test(line.text)) {
                console.log("Hittat: ", line.lineNumber);
                kommentar.push({
                    range: new vscode.Range(line.range.start, line.range.end),
                    hoverMessage: 'Number **123**'
                });
            }
        }
        /* Highlighta alla hittade rader */
        editor.setDecorations(smallNumberDecorationType, kommentar);

        /* Skapa en sidopanel */
        const panel = vscode.window.createWebviewPanel(
            "console.log()",
            "Kommentarer",
            vscode.ViewColumn.Beside, {
                // Enable javascript in the webview
                enableScripts: true,
            }
        );
        panel.webview.html = '<!DOCTYPE html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Test</title><link rel="stylesheet" href="style.css"></head><body><h1>Test</h1></body></html>';
    }
}

module.exports = Cleaner;