const vscode = require("vscode");
const path = require("path");

class Cleaner {
    clearConsoleLogs(context) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("Inget öppet dokument!");
            return;
        }

        /* Hämta nuvarande dokument */
        const doc = editor.document;

        /* Skapa en sidopanel */
        const panel = vscode.window.createWebviewPanel(
            "console.log()",
            "Kommentarer",
            vscode.ViewColumn.Beside, {
                // Enable javascript in the webview
                enableScripts: true
            }
        );
        panel.webview.html = getWebviewContent();

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
        /* const regex = /(console.log\(\)|console.log\(.+\));/; */
        const regex = /\/\*.*\*\/|\/\//;

        /* Gå igenom alla rader */
        for (let i = 0; i < doc.lineCount; i++) {

            /* Plocka ut raden */
            const line = doc.lineAt(i);

            /* Hittat en console.log() */
            if (regex.test(line.text)) {
                console.log("Hittat log rad: ", line.lineNumber);
                kommentar.push({
                    range: new vscode.Range(line.range.start, line.range.end),
                    hoverMessage: 'Log'
                });
                panel.webview.postMessage({
                    command: 'Hittat: '+ line.lineNumber + '<br>'
                });
            }
        }
        /* Highlighta alla hittade rader */
        editor.setDecorations(smallNumberDecorationType, kommentar);
    }
}

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="sv">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Test</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <h1>Kommentar i koden</h1>
        <p></p>
        <script>
            const lista = document.querySelector('p');

            // Handle the message inside the webview
            window.addEventListener('message', event => {
                const message = event.data; // The JSON data our extension sent
                lista.innerHTML += message.command;
            });
        </script>
    </body>
    </html>`;
}

module.exports = Cleaner;