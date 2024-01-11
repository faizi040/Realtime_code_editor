import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import EditorPage from "./Pages/EditorPage";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
    <div>
      <Toaster
      position="top-right"
      toastOptions={{
        success:{
          theme:{
            primary:'#13F9EB',
          },
        },
      }}
      >

      </Toaster>
    </div>
      <BrowserRouter>
        <Routes>

          <Route exact path="/" element={<Home />} ></Route>
          <Route exact path="/editor/:roomId" element={<EditorPage />} ></Route>


        </Routes>


      </BrowserRouter>

    </>
  )
}

export default App
