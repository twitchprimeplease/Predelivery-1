class StartScreen {
    constructor(){

    }

    show(){
        let instructionsButton = createButton("Instrucciones");
        instructionsButton.mousePressed(() => {
        screenController = 'InstructionsScreen'
        socket.emit('mobile-screen', {

            screen: 'InstructionsScreen'
        });
    });
    }
}