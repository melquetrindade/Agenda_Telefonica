import React, {useState} from "react";
import { useRouter } from "next/router";
import styles from '../styles/edit_phone.module.css'
import {message} from 'antd'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function EditPhone(){

    const router = useRouter()
    const {id, num, idNum} = router.query
    console.log(`id: ${id} - num: ${num} - idNum: ${idNum}`)

    const [numTell, setNum] = useState(num)

    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';

    const openMessage = () => {
        messageApi.open({
        key,
        type: 'loading',
        content: 'Loading...',
        });
        setTimeout(() => {
            messageApi.open({
                key,
                type: 'success',
                content: 'Loaded!',
                duration: 2,
            });
        }, 1000);
    };

    const handleChangeNumber = (e) => {
        const inputText = e.target.value

        if (/^[0-9']+$/.test(inputText) || inputText === '') {
            setNum(inputText)
        }
    }

    const formataDado = () => {

        const objTell = {
            owner: id,
            telefone: document.getElementById('formGridNum').value
        }

        if(objTell.telefone.length == 9){
            openMessage()
            saveNum({objData: objTell})
        }

    }

    const saveNum = async ({objData}) => {
        fetch(`http://127.0.0.1:8000/telefones/${idNum}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(objData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            router.push({
                pathname: './contacts',
            })
        })
        .catch(error => {
            console.error('Erro durante a requisição POST:', error);
        });
    }

    return(
        <main className={styles.main}>
            {
                id && num && idNum
                ?
                    <Body change={handleChangeNumber} formValue={numTell} func={formataDado} context={contextHolder}/>
                :
                    <Load/>
            }
        </main>
    )
}

function Load(){
    return(
        <div className={styles.fade}>
            <div class="spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

function Body({change, formValue, func, context}){

    return(
        <>
            {context}
            <h1 className={styles.title}>Edite o Número de Telefone <span class="material-symbols-outlined">call</span></h1>
            <hr></hr>
            <Form>
                <Form.Group className={styles.formNum} controlId="formGridNum">
                <Form.Label>Número</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="999999999" 
                    required 
                    minLength="9" 
                    maxlength="9"
                    onChange={change}
                    value={formValue}
                />
                </Form.Group>

                <Button variant="success" size="sm" onClick={func}>Salvar <span class="material-symbols-outlined">done</span></Button>
            </Form>
        </>
    )
}