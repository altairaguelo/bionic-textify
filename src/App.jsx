import { useRef , useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  //testing out backend connection stuff
  // const [backendData, setBackendData] = useState([{}])

  // useEffect(() => {
  //   fetch("/api").then(
  //     response => response.json()
  //   ).then(
  //     data => {
  //       setBackendData(data)
  //     }
  //   )
  // }, [])

  const textToEdit = useRef(null);
  // save text consts
  const [savedTexts, setSavedTexts] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  const toBionicText = () => {
    const textBox = textToEdit.current;
    if(textBox) {
      const rawText = textBox.innerText;
      setUserInput(rawText);
      const words = rawText.split(' ');

      const processedWords = [];
      words.forEach((word) => {
        if(word.length === 0){
          processedWords.push('');
        }
        else if(word.length <= 3){
          const updatedWord = `<b>${word.substring(0,1)}</b>${word.substring(1)}`;
          processedWords.push(updatedWord)
        }
        else{
          const highlightIdx = Math.ceil(word.length / 2);
          const updatedWord = `<b>${word.substring(0, highlightIdx)}</b>${word.substring(highlightIdx)}`;
          processedWords.push(updatedWord)
        }
      });

      textBox.innerHTML = processedWords.join(' ');
      setGeneratedText(textBox.innerHTML);
    }
  };

  const refreshBox = () => {
    const textBox = textToEdit.current;
    if (textBox) {
      textBox.innerHTML = '';
    }
  };

  // actual text/data functionality

  //on reload, auto show saved texts
  useEffect(() => {
    loadSaved();
  }, []);

  const handleSave = async () => {
    if (!userInput || !generatedText) {
      alert("Please bionic-textify something first!");
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputText: userInput,
          bionicText: generatedText
        })
      });
  
      if (!res.ok) throw new Error('Failed to save text');
      alert('Text saved successfully!');
      loadSaved();
    } catch (err) {
      console.error(err);
      alert('Failed to save text');
    }
  };

  const loadSaved = async() => {
    const res = await fetch('http://localhost:5000/saved');
    const data = await res.json(); //important to use await
    // console.log('loaded saved data: ', data);
    setSavedTexts(data);
  };

  const handleDelete = async (id) => {
    console.log('delete item clicked for', id);
    try {
      const res = await fetch(`http://localhost:5000/delete/${id}`, {
        method: 'DELETE'
      });
  
      if (!res.ok) throw new Error('Delete failed');
  
      setSavedTexts(savedTexts.filter(entry => entry.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete text');
    }
  };

  const loadText = (html) => {
    const textBox = textToEdit.current;
    if(textBox){
      textBox.innerHTML = html;
      textBox.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <>
      {/* display data fetched test */}
      {/* {(typeof backendData.users === 'undefined') ? (
        <p>Loading Data...</p>
      ): (
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )} */}

      <div className='flex-col h-full'>
        <h1>Bionic Textify</h1>
        <p>
          Make any text easier and quicker to read by making it bionic! Simply 
          input your text into the box, click the Bionic Textify button, and view 
          your new, highlighted and bolded text that guides your eyes for faster reading.
        </p>
        <button onClick={handleSave} className='float-right my-2 bg-amber-600 border-2 border-amber-950 text-amber-950 hover:border-white hover:text-white'>Save Text</button>
        <button onClick={refreshBox} className='float-right my-2 bg-amber-600 border-2 border-amber-950 text-amber-950 hover:border-white hover:text-white'>Reset Text Area</button>
        <button onClick={toBionicText} className='float-right my-2 bg-amber-600 border-2 border-amber-950 text-amber-950 hover:border-white hover:text-white overflow-auto'>Bionic-Textify!</button>
        <div ref={textToEdit} contentEditable='plaintext-only' className='bg-amber-50 text-gray-800 w-full h-100 mt-5 rounded-lg overflow-auto'/>

        {/* testing viewing if texts save */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-2">Saved Bionic Texts</h2>

          {savedTexts.length === 0 ? (
            <p className="text-gray-600">No saved texts yet.</p>
          ) : (
            <ul className="space-y-4">
              {savedTexts.map((entry) => (
                <li onClick={() => loadText(entry.bionicText)} key={entry.id} className="hover:cursor-pointer hover:scale-102 border border-gray-300 p-4 rounded bg-white text-black">
                  {/* <p><strong>Original:</strong> {entry.inputText}</p> */}
                  <p className='flex justify-between'>
                    {/* <strong>Bionic:</strong>{' '} */}
                    <span
                      dangerouslySetInnerHTML={{ __html: entry.bionicText }}
                    />
                    <button onClick={() => handleDelete(entry.id)} className='bg-amber-600 border-2 border-amber-950 text-amber-950 hover:border-neutral-400 hover:text-white h-13' >X</button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Saved: {new Date(entry.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
          
        </div>

      </div>
    </>
  )
}

export default App
