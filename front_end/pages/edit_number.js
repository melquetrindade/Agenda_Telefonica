import React, {useState} from "react";
import { useRouter } from "next/router";
import styles from '../styles/edit_number.module.css'
import {notification, message} from 'antd'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

export default function EditPhone(){

    const router = useRouter()
    const {id, num, idNum} = router.query
    console.log(`id: ${id} - num: ${num} - idNum: ${idNum}`)

    const [numTell, setNum] = useState(num)

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if(numTell == undefined && num){
        setNum(num)
    }

    const [api, contextHolder2] = notification.useNotification();
    const openNotification = ({placement, title, descricao}) => {
        api.info({
            message: `${title}`,
            description: `${descricao}`,
            placement,
        });
    }

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
        else{
            openNotification({placement: 'topRight', title: 'Erro', descricao: 'O número deve conter 9 dígitos!'})
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
            setTimeout(function () {
                router.push({
                    pathname: './edit_phone',
                    query: {id: id}
                })
            }, 1500);
        })
        .catch(error => {
            console.error('Erro durante a requisição POST:', error);
        });
    }

    const navPagAnterior = () => {
        router.push({
            pathname: './edit_phone',
            query: {id: id}
        })
    }

    const navContacts = () => {
        router.push({
            pathname: '../contacts'
        })
    }

    return(
        <main className={styles.main}>
            {
                id && num && idNum
                ?
                    <Body 
                        change={handleChangeNumber} 
                        formValue={numTell} 
                        func={formataDado} 
                        context={contextHolder}
                        context2={contextHolder2}
                        show={show}
                        funcHandleClose={handleClose}
                        funcHandleShow={handleShow}
                        navPagInicial={navContacts}
                        navEditCont={navPagAnterior}
                    />
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

function Body({
    change, 
    formValue, 
    func, 
    context, 
    context2,
    show,
    funcHandleClose,
    funcHandleShow,
    navPagInicial,
    navEditCont
    }){

    return(
        <>
            {context}
            {context2}
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
                <hr></hr>
                <div className={styles.contButtons}>
                    <Button variant="success" size="sm" onClick={func}>
                        Salvar <span class="material-symbols-outlined">done</span>
                    </Button>
    
                    <Button variant="danger" size="sm" onClick={funcHandleShow}>
                        Cancelar Alterações<span class="material-symbols-outlined">cancel</span>
                    </Button>

                    <Modal
                        show={show}
                        onHide={funcHandleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Alteração Cancelada</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            Para onde deseja ser redirecionado?
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={navPagInicial}>
                                Página Inicial
                            </Button>
                            <Button variant="primary" onClick={navEditCont}>
                                Voltar a Página anterior
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Form>
        </>
    )
}