// ===========================
// CONFIGURAÇÃO DE NOTAS
// ===========================

const notes = [
    { name: 'C', frequency: 261.63, isBlack: false, isNatural: true },
    { name: 'C#', frequency: 277.18, isBlack: true, isNatural: false },
    { name: 'D', frequency: 293.66, isBlack: false, isNatural: true },
    { name: 'D#', frequency: 311.13, isBlack: true, isNatural: false },
    { name: 'E', frequency: 329.63, isBlack: false, isNatural: true },
    { name: 'F', frequency: 349.23, isBlack: false, isNatural: true },
    { name: 'F#', frequency: 369.99, isBlack: true, isNatural: false },
    { name: 'G', frequency: 392.0, isBlack: false, isNatural: true },
    { name: 'G#', frequency: 415.3, isBlack: true, isNatural: false },
    { name: 'A', frequency: 440.0, isBlack: false, isNatural: true },
    { name: 'A#', frequency: 466.16, isBlack: true, isNatural: false },
    { name: 'B', frequency: 493.88, isBlack: false, isNatural: true },
];

// ===========================
// CONTEXTO DE ÁUDIO
// ===========================

let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// ===========================
// FUNÇÕES DE ÁUDIO
// ===========================

function playNote(frequency, duration = 0.5) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = frequency;
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

function playSequence(frequencies, interval = 0.3) {
    frequencies.forEach((freq, index) => {
        setTimeout(() => {
            playNote(freq, 0.4);
        }, index * interval * 1000);
    });
}

// ===========================
// TECLADO DE PIANO
// ===========================

function initPiano() {
    const pianoKeys = document.getElementById('pianoKeys');
    
    notes.forEach((note, idx) => {
        const key = document.createElement('button');
        key.className = `piano-key ${note.isBlack ? 'piano-key-black' : 'piano-key-white'}`;
        key.title = `${note.name} (${note.frequency.toFixed(2)} Hz)`;
        key.textContent = note.name;
        
        key.addEventListener('click', () => {
            playPianoKey(key, note);
        });
        
        pianoKeys.appendChild(key);
    });
}

function playPianoKey(keyElement, note) {
    // Adiciona classe de ativo
    const isBlack = note.isBlack;
    const activeClass = isBlack ? 'active-semitom' : 'active-tom';
    
    keyElement.classList.add(activeClass);
    playNote(note.frequency);
    
    // Remove classe após animação
    setTimeout(() => {
        keyElement.classList.remove(activeClass);
    }, 200);
}

// ===========================
// EXEMPLOS DE ÁUDIO
// ===========================

function setupAudioExamples() {
    // Semitom: Dó → Dó#
    const playSemitonBtn = document.getElementById('playSemitom');
    if (playSemitonBtn) {
        playSemitonBtn.addEventListener('click', () => {
            const cFreq = 261.63;
            const cSharpFreq = 277.18;
            playSequence([cFreq, cSharpFreq], 0.4);
        });
    }

    // Tom: Dó → Ré
    const playTomBtn = document.getElementById('playTom');
    if (playTomBtn) {
        playTomBtn.addEventListener('click', () => {
            const cFreq = 261.63;
            const dFreq = 293.66;
            playSequence([cFreq, dFreq], 0.4);
        });
    }

    // Escala Maior: Dó Maior
    const playScaleBtn = document.getElementById('playScale');
    if (playScaleBtn) {
        playScaleBtn.addEventListener('click', () => {
            const cMajorFrequencies = [
                261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25,
            ];
            playSequence(cMajorFrequencies, 0.3);
        });
    }
}

// ===========================
// INICIALIZAÇÃO
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    initPiano();
    setupAudioExamples();
});
