// Loads Portfolio Files
const pages = [
    'projects/tut.txt',
    'projects/pinball.txt',
    'projects/isr-expansion.txt',
    'projects/stm32-alarm-clock.txt'
];
// var SVG_NS = 'http://www.w3.org/2000/svg';
let currentIndex = 0;
const displayArea = document.getElementById('lcd-title');
const button = document.getElementById('cycle-btn');

// Function to fetch and display the text file
async function loadPortfolio(filePath) {
    //const maxCharsPerLine = Math.floor(displayArea.clientWidth / 24);
    try {
        displayArea.textContent = "Loading...";
        
        // Fetch the file from your GitHub Pages site
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}`);
        }
        
        const textData = await response.text();
        const title = textData.split('\n')[0]; // Get the first line as title
        const content = textData.split('\n').slice(1).join('\n'); // Get the rest as content
         
        changeLCD(title, parseForMD(content,fontSize=22));

    } catch (error) {
        displayArea.textContent = `Error: ${error.message}`;
        console.error(error);
    }
}

function parseForMD(markdownText, options = {}) {
  /* No longer nessicary in current application 
   const fontSize = options.fontSize || 22;
   const maxChars = options.maxChars || 60; // Max characters allowed per line
   const startX = options.startX || 10;
   const lineHeight = Math.round(fontSize * 1.25); //
  */

  // 1. Tokenize Markdown targets so formatting characters don't mess up our text length count
  let processedText = markdownText
    .replace(/\*\*(.*?)\*\*/g, '___B___$1___EB___')
    .replace(/\*(.*?)\*/g, '___I___$1___EI___');
    //TODO impliment further HTML inline elements 
    //TODO Consider breaking the <p> element into a <div> adding <p>, <h#>, and other elements

  const sourceLines = processedText.split('\n');
  const finalWrappedLines = [];

  // No longer nessicary in current implimentation, however may be useful in future
  sourceLines.forEach(sourceLine => {
    const words = sourceLine.split(' ');
    let currentLine = [];

    words.forEach(word => {
      // Find the visual character length of the word by stripping out token wrappers
      // const cleanWord = word.replace(/___B___|___EB___|___I___|___EI___/g, '');
        currentLine.push(word);
    });

    if (currentLine.length > 0) {
      finalWrappedLines.push(currentLine.join(' '));
    }
  });

  // 2. Build the native SVG elements
  let tspanMarkup = '';

  finalWrappedLines.forEach((wrappedLine, index) => {
    // Replace tokens for inline p
    let lineHtml = wrappedLine
      .replace(/___B___/g, '<b>')
      .replace(/___EB___/g, '</b>')
      .replace(/___I___/g, '<i>')
      .replace(/___EI___/g, '</i>');

    if (index === 0) {
      tspanMarkup += `${lineHtml}<br>`;
    } else {
      tspanMarkup += `${lineHtml}<br>`;
    }
  });
  // console.log(tspanMarkup);
  return tspanMarkup;
}

  // Pass null/undefined to leave a field unchanged. "\n" in content = new line.
function changeLCD(newTitle, newContent) {
    var title = document.getElementById('lcd-title');
    var content = document.getElementById('lcd-text');
    if (title && newTitle != null) title.innerHTML = newTitle;
    if (content && newContent != null) content.innerHTML = newContent;
}

// Buttons!


/*
// Terminal Scrolling Buttons
const upArrow = document.getElementById('scroll-up');
const downArrow = document.getElementById('scroll-down');
upArrow.addEventListener('click', () => {
    alert('up was clicked!');
});

downArrow.addEventListener('click', () => {
    alert('down was clicked!');
});
*/

// Portfolio Navigation Buttons
const leftArrow = document.getElementById('scroll-left');
const rightArrow = document.getElementById('scroll-right');
leftArrow.addEventListener('click', () => {
  currentIndex = currentIndex == 0 ? pages.length - 1 : currentIndex - 1;
  loadPortfolio(pages[currentIndex]);
});

rightArrow.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % pages.length;
  loadPortfolio(pages[currentIndex]);
});


loadPortfolio(pages[currentIndex]); // Load the first file on page load