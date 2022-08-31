class InstructionsScreen {
    constructor(){

    }

    show(){
        let instructionsButton = createButton("Instructions");
    instructionsButton.mousePressed(() => {
        screenController = 'InstructionsScreen'
        socket.emit('mobile-screen', {
            screen: 'InstructionsScreen'
        });
    });
    }
}