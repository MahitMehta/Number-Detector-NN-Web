let boardEdited = false;

class Board {
    constructor(containerId) {
        this.containerId = containerId;
    }
    create() {
        new DrawingBoard.Board(this.containerId, {
            color: "#fff",
            webStorage: false,
            background: "red",
            size: 25,
            controls: false
        });
        $(".clear-board").click(() => {
            boardEdited = false;
            this.clear();
        });
        $(`.drawing-board-canvas`).on("mousedown", () => {
            boardEdited = true;
        })
        $(`.drawing-board-canvas`).on("touchstart", () => {
            boardEdited = true;
        })
    }
    clear() {
        $('.guess').html("");
        $('.correct-number').val("");
        $(".drawing-board-controls").remove();
        $(".drawing-board-canvas-wrapper").remove();
        this.create();
    }
    getPixels() {
        const canvas = $(".drawing-board-canvas")[0];
        const dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
}

$(document).ready(() => {
    const board = new Board("drawing-board");
    board.create();
    $(".guess-button").click(() => {
        if (!boardEdited) {
            $('.guess').html("Please First Draw a Number!");
            return
        }
        $('.guess').html("");
        const imageData = board.getPixels();
        const correctNumber = parseInt($(".correct-number").val());
        let validCorrectNumber = false;
        if (!isNaN(correctNumber) && correctNumber / 10 < 1) 
            validCorrectNumber = true;
        let body;
        if (validCorrectNumber) {
            body = JSON.stringify({ dataURL: imageData, number: correctNumber });
        } else {
            body = JSON.stringify({ dataURL: imageData });
        }
        fetch("/image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        })
        .then(res => res.json())
        .then(data => {
            const guess = data.guess;
            $('.guess').html(`The Number is ${guess}`)
        })
        .catch(() => console.log("There was an Error Processing the Number!"))
    });
    
});