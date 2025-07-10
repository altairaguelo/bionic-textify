import { useRef , useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { db, auth } from './firebase.js';
import { ref, push, set, onValue, remove } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';

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

  //setting up firebase w/ auth
  const [user] = useAuthState(auth);

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

  // on reload, auto show saved texts, works locally
  // useEffect(() => {
  //   loadSaved();
  // }, []);

  //checking uid
  useEffect(() => {
    if (user){
      console.log('Signed in as: ', user.uid);
    }
  }, [user]);

  // trying firebase loading saved on startup
  useEffect(() =>{
    if (!user) return;
    const userRef = ref(db, `users/${user.uid}`);
    onValue(userRef, (snapshot) =>{
      const data = snapshot.val();
      if(data) {
        const entries = Object.entries(data).map(([id, value]) =>({
          id,
          ...value
        }));
        setSavedTexts(entries.reverse());
      } else{
        setSavedTexts([]);
      }
    });
  }, [user]);

  // this save version below worked for local saving
  // const handleSave = async () => {
  //   if (!userInput || !generatedText) {
  //     alert("Please bionic-textify something first!");
  //     return;
  //   }
  
  //   try {
  //     const res = await fetch('/api/save', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         inputText: userInput,
  //         bionicText: generatedText
  //       })
  //     });
  
  //     if (!res.ok) throw new Error('Failed to save text');
  //     alert('Text saved successfully!');
  //     loadSaved();
  //   } catch (err) {
  //     console.error(err);
  //     alert('Failed to save text');
  //   }
  // };

  // trying saving to firebase
  const handleSave = async () =>{
    if(!userInput || !generatedText){
      alert("Please bionic-textify something first!");
      return;
    }

    const newRef = push(ref(db, `users/${user.uid}`));
    await set(newRef, {
      inputText: userInput,
      bionicText: generatedText,
      createdAt: new Date().toISOString()
    });
    alert('Text saved succesfully!')
  }

// for loading data when local
//   const loadSaved = async() => {
//     const res = await fetch('/api/saved');
//     const data = await res.json(); //important to use await since want JSON to finish parse first
//     // console.log('loaded saved dataimport { class } from './../node_modules/@babel/parser/lib/index';
// //: ', data);
//     setSavedTexts(data);
//   };

  // delete for local
  // const handleDelete = async (id) => {
  //   console.log('delete item clicked for', id);
  //   try {
  //     const res = await fetch(`/api/delete/${id}`, {
  //       method: 'DELETE'
  //     });
  
  //     if (!res.ok) throw new Error('Delete failed');
  
  //     setSavedTexts(savedTexts.filter(entry => entry.id !== id));
  //   } catch (err) {
  //     console.error(err);
  //     alert('Failed to delete text');
  //   }
  // };

  // delete for firebase
  const handleDelete = async (id) =>{
    const deleteRef = ref(db, `users/${user.uid}/${id}`);
    await remove(deleteRef);
  };

  // load text into box by clicking, works both local and fb
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
        <h1 className='mb-2'><b>Bio</b>nic <b>Text</b>ify</h1>
        <p>
          <b>Ma</b>ke <b>a</b>ny <b>te</b>xt <b>eas</b>ier <b>a</b>nd <b>quic</b>ker <b>t</b>o <b>re</b>ad <b>b</b>y <b>mak</b>ing <b>i</b>t <b>bion</b>ic! <b>Sim</b>ply <b>inp</b>ut <b>yo</b>ur <b>te</b>xt <b>in</b>to <b>t</b>he <b>bo</b>x, <b>cli</b>ck <b>t</b>he <b>Bio</b>nic <b>Text</b>ify <b>butt</b>on, <b>a</b>nd <b>vi</b>ew <b>yo</b>ur <b>ne</b>w, <b>highli</b>ghted <b>a</b>nd <b>bol</b>ded <b>te</b>xt <b>th</b>at <b>gui</b>des <b>yo</b>ur <b>ey</b>es <b>f</b>or <b>fas</b>ter <b>read</b>ing.
        </p>
        <button onClick={handleSave} className='float-right my-2 bg-amber-600 border-2 border-amber-950 text-amber-950 hover:border-white dark:hover:text-white mx-1'>Save Text</button>
        <button onClick={refreshBox} className='float-right my-2 bg-amber-600 border-2 border-amber-950 text-amber-950 hover:border-white dark:hover:text-white mx-1'>Reset Text Area</button>
        <button onClick={toBionicText} className='float-right my-2 bg-amber-600 border-2 border-amber-950 text-amber-950 hover:border-white dark:hover:text-white overflow-auto mx-1'>Bionic-Textify!</button>
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
                    <button onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }} className='border-2 border-amber-950 text-amber-950 hover:border-red-500 hover:text-red-500 h-13' >X</button>
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
