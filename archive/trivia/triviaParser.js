async function parse() {
    let triviaJson = await fetch ("https://acidfog.com/trivia/trivia.txt")
        .then(data => data.text())
        .then((text) => {
            const parsedLines = text.split("\n");
            console.log(parsedLines);
            let jsonObj = [];

            parsedLines.forEach((line) => {
                const parsedLine = line.split("!");
                jsonObj.push({
                    question: parsedLine[0],
                    answers: [parsedLine[1], parsedLine[2], parsedLine[3], parsedLine[4]],
                    responseTrue: parsedLine[5],
                    responseFalse: parsedLine[6]
                });
            });
            return jsonObj;
        });

    console.log(triviaJson);
}

parse();