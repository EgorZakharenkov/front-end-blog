import React, {useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {Navigate, useNavigate, useParams} from "react-router-dom";

import axios from "../../axios";

export const AddPost = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const inputFileRef = useRef(null)
    const [value, setValue] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [look, setLook] = React.useState(false);

    const [tags, setTags] = React.useState('');
    const [imageUrl, setImageUrl] = React.useState('');
    const isEditing = Boolean(id)


    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData()
            formData.append('image',event.target.files[0])
            const {data} = await axios.post('/upload',formData)
            setImageUrl(data.url)
        }catch (err){
            console.log(err)
        }
    };

  const onClickRemoveImage = () => {
      setImageUrl(null)
  };

  const onChange = React.useCallback((value) => {
    setValue(value);
  }, []);

    const handlePublic = async ()=>{
        try {
            const postsInfo = {
                name:title,
                description:value,
                animeURL:tags,
                look:look,
            };
            const {data} = isEditing ?  await axios.patch(`/posts/${id}`,postsInfo) :  await axios.post('/posts',postsInfo)


            const Id = isEditing ? id :data._id;
            navigate(`/posts/${Id}`)
        }catch (err){
            alert("Ошибка")
        }

    }


    React.useEffect(()=>{
      if(id){
          axios.get(`/posts/${id}`)
              .then(({data})=>
              {
                  setTitle(data.name);
                  setValue(data.description);
                  setTags(data.animeURL);
                  setLook(data.look);
              })

      }
  },[])
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );
    if(!window.localStorage.getItem('token')){
        return <Navigate to='/'/>
    }
  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={()=>inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          hidden
      />
      {imageUrl && (
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
      )}
      {imageUrl && (
        <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />
        <div className={styles.look}>
            <span>Добавить в просмотренные ?</span>
            <input onChange={(e)=>setLook(e.target.checked)} checked={look} type="checkbox" placeholder='Просмотренные?'/>
        </div>
      <TextField onChange={e=>setTags(e.target.value)} value={tags} classes={{ root: styles.tags }} variant="standard" placeholder="ссылка на картинку" fullWidth />
      <SimpleMDE className={styles.editor} value={value} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={handlePublic} size="large" variant="contained">
            {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
