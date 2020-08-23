let currentObject = 0;
const objects = [
    {
        alt:'banana',
        src:'../assets/banana-comic.png'
    },
    {
        alt:'fork',
        src:'../assets/fork.png'
    },
    {
        alt:'book',
        src:'../assets/book.png'
    }
];

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function generatePassword() {
    const password = shuffle(objects);
    const container = document.querySelector('.password');
    
    container.innerHTML = '';
    
    password.forEach(object => {
      const img = document.createElement('img');
      img.src = object.src;
      img.alt = object.alt;
      
      container.appendChild(img);
    });
    
    return password;
}

function detectObjects(video,model){
    // detect objects in the image.
    model.detect(video).then(predictions => {        
        if (currentObject === password.length) {
            document.querySelector('.current-predictions').innerText = 'UNLOCKED';
            return;
        }
          
        const match = predictions.find(p => password[currentObject].alt === p.class);
        if (match) {
            document.querySelector(`[alt=${match.class}]`).classList.add('found');
            currentObject++;
        }

        document.querySelector('.current-predictions').innerHTML = JSON.stringify(predictions, null, 2)
    });
    window.requestAnimationFrame(()=>detectObjects(video,model))
}

const password = generatePassword();

navigator.mediaDevices.getUserMedia({
    video: true
}).then((stream) => {
    const video = document.querySelector('#webcam');
    
    video.srcObject = stream;

    video.addEventListener('loadeddata', ()=>{
        cocoSsd.load().then(model => {
            detectObjects(video,model);            
        });
    });
})

