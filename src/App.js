import React from 'react'
import Container from "@mui/material/Container";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import {Routes,Route} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuthMe, selectorIsAuth} from "./redux/slices/auth";

function App() {
    const dispatch = useDispatch()
    const isAuth = useSelector(selectorIsAuth)

    React.useEffect(()=>{
        dispatch(fetchAuthMe())
    },[])
  return (
    <>

      <Header />
      <Container maxWidth="lg">
          <Routes>
              <Route path = "/" element={<Home/>}/>
              <Route path = "/login" element={<Login/>}/>
              <Route path = "/posts/:id" element={<FullPost/>}/>
              <Route path = "/posts/:id/edit" element={<AddPost/>}/>
              <Route path = "register" element={<Registration/>}/>
              <Route path = "/add-post" element={<AddPost/>}/>
          </Routes>
      </Container>
    </>
  );
}

export default App;
