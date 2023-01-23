var gateway = `ws://${window.location.hostname}/ws`;
var websocket;
window.addEventListener('load', onload);
var direction;

function onload(event) {
    initWebSocket();
}

function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

function onOpen(event) {
    console.log('Connection opened');
}

function onClose(event) {
    console.log('Connection closed');
    document.getElementById("motor-state").innerHTML = "motor stopped"
    setTimeout(initWebSocket, 2000);
}

function submitForm(direction){
    document.getElementById("motor-state").innerHTML = "motor spinning...";
    document.getElementById("motor-state").style.color = "green";
    if (direction=="up" || direction=="right"){
        document.getElementById("gear").classList.add("spin");
    }
    else{
        document.getElementById("gear").classList.add("spin-back");
    }  
    var degrees = document.getElementById("degrees").value;
    var steps = 0;
    if (direction == "up" || direction =="down"){
        var steps = Math.round(degrees * 65.0991488888889);
    }
    else{
        var steps = Math.round(degrees * 46.41852355555556);
    }
    websocket.send(steps+"&"+direction);
    console.log("sent command to move "+steps+" in direction: "+direction);
}

function onMessage(event) {
    console.log(event.data);
    direction = event.data;
    if (direction=="stop"){ 
      document.getElementById("motor-state").innerHTML = "motor stopped"
      document.getElementById("motor-state").style.color = "red";
      document.getElementById("gear").classList.remove("spin", "spin-back");
    }
    else if(direction=="up" || direction=="down" || direction=="left" || direction=="right"){
        document.getElementById("motor-state").innerHTML = "motor spinning...";
        document.getElementById("motor-state").style.color = "blue";
        if (direction=="up" || direction=="right"){
            document.getElementById("gear").classList.add("spin");
        }
        else{
            document.getElementById("gear").classList.add("spin-back");
        }
    }
}