import React, {useState} from "react";
import { useRouter } from "next/router";
import styles from '../styles/edit_contacts.module.css'
import {notification, message} from 'antd'

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';

export default function EditContacts(){

    const router = useRouter()
    const { id } = router.query
    console.log(`id: ${id}`)

    const [objContato, setContato] = useState({
        nome: '',
        email: '',
        status: 'load'
    })

    const [has_replay, setReplay] = useState('load')

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [api, contextHolder] = notification.useNotification();
    const openNotification = ({placement, title, descricao}) => {
        api.info({
            message: `${title}`,
            description: `${descricao}`,
            placement,
        });
    }

    const [messageApi, contextHolder2] = message.useMessage();
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
    const editaContato = async ({objData}) => {
        fetch(`http://127.0.0.1:8000/contatos/${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(objData),
        })
        .then(response => {
            
            if (!response.ok) {
                console.log('falha ao fazer a edição')
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('edição realizada com sucesso')
            handleShow()
            
        })
        .catch(error => {
            console.error('Erro durante a requisição POST:', error);
        });
    }

    console.log(`has_replay: ${has_replay}`)

    const checkEmail = async ({email}) => {
        fetch(`http://127.0.0.1:8000/contatos/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then(response => {
            
            if (!response.ok) {
                //console.log('falha ao carregar email')
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            var filterData = data.filter(item => item.email == email && item.id != id)
            if(filterData.length != 0){
                setReplay('verdadeiro')
            }
            else{
                setReplay('falso')
            }
        })
        .catch(error => {
            console.error('Erro durante a requisição POST:', error);
        });
    }

    if(has_replay == 'falso'){
        setReplay('load')
        console.log('continua na função')
        const dataContato = {
            nome: document.getElementById('formGridName').value,
            email: document.getElementById('formGridEmail').value,
        };

        var ok = true
        try{
            Object.keys(dataContato).forEach(key => {
                if(!dataContato[key]){
                    console.log(`entrou aqui: ${key}`)
                    ok = false
                    openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
                    throw new Error('StopIteration');
                    
                }
            });
        } catch(error){
            if (error.message !== 'StopIteration') {
                //throw error;
                console.log('campo em branco')
            }
        }

        if(ok){
            console.log('entrou para o editar')
            editaContato({objData: dataContato})
        }
    }
    if(has_replay == 'verdadeiro'){
        setReplay('load')
        openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Este E-mail já está sendo usado!'})
    }

    const formatData = () => {
        
        checkEmail({email: document.getElementById('formGridEmail').value})

        /*
        const dataContato = {
            nome: document.getElementById('formGridName').value,
            email: document.getElementById('formGridEmail').value,
        };

        var ok = true
        try{
            Object.keys(dataContato).forEach(key => {
                if(!dataContato[key]){
                    console.log(`entrou aqui: ${key}`)
                    ok = false
                    //openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
                    throw new Error('StopIteration');
                    
                }
            });
        } catch(error){
            if (error.message !== 'StopIteration') {
                throw error;
            }
        }

        if(ok){
            editaContato({objData: dataContato})
        }*/

    }

    const carregaContato = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/contatos/${id}/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                setContato({
                    nome: undefined,
                    email: undefined,
                    status: 'erro'
                })
            }

            const data = await response.json();
            
            setContato({
                nome: data.nome,
                email: data.email,
                status: 'ok'
            })

        } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setContato({
                nome: undefined,
                email: undefined,
                status: 'erro'
            })
        }
    }

    if(objContato.status == 'load' && id != undefined){
        carregaContato()
    }

    const handleChangeName = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setContato({
                nome: inputText,
                email: objContato.email,
                status: objContato.status
            })
        }
    }

    const handleChangeEmail = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9 @ . ']+$/.test(inputText) || inputText === '') {
            setContato({
                nome: objContato.nome,
                email: inputText,
                status: objContato.status
            })
        }
    }

    const cancelOperation = () => {
        router.push({
            pathname: './contacts'
        })
    }

    const navEndereco = () => {
        router.push({
            pathname: './edit_endereco',
            query: {id: id}
        })
    }

    return(
        <main className={styles.main}>
            {
                objContato.status == 'load'
                ?
                    <Load/>
                :
                objContato.status == 'erro'
                ?
                    <Error/>
                :
                <Forms
                    context01={contextHolder}
                    context02={contextHolder2}
                    changeName={handleChangeName}
                    changeEmail={handleChangeEmail}
                    nome={objContato.nome}
                    email={objContato.email}
                    funcNext={navEndereco}
                    funcCancel={cancelOperation}
                    show={show}
                    funcHandleClose={handleClose}
                    funcFormatData={formatData}
                />
            }
        </main>
    )
}

function Forms({
    context01, 
    context02, 
    changeName, 
    nome, 
    changeEmail, 
    email, 
    funcNext,
    funcCancel,
    show,
    funcHandleClose,
    funcFormatData
    }){

    return(
        <div className={styles.body}>
            {context01}
            {context02}
            <h1>Contatos</h1>
            <hr></hr>
            <Container>
                <Row className={styles.rowTop}>
                    <Col className={styles.colOne}>
                        <Form className={styles.formContato}>
                            <Form.Group controlId="formGridName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Fulano de Tal" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeName}
                                value={nome}
                            />
                            </Form.Group>
        
                            <Form.Group controlId="formGridEmail">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="fulado@gmail.com" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeEmail}
                                value={email}
                            />
                            </Form.Group>
                        </Form>
                    </Col>

                </Row>

            </Container>
            <div className={styles.contButtons}>
                <Button variant="success" size="sm" onClick={funcFormatData}>
                    Salvar Alterações<span class="material-symbols-outlined">check</span>
                </Button>

                <Button variant="primary" size="sm" onClick={funcNext}>
                    Editar Endereço<span class="material-symbols-outlined">navigate_next</span>
                </Button>
    
                <Button variant="danger" size="sm" onClick={funcCancel}>
                    Cancelar Alterações<span class="material-symbols-outlined">cancel</span>
                </Button>

                <Modal
                    show={show}
                    onHide={funcHandleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Alterações realizadas com sucesso!</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Para onde deseja ser redirecionado?
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={funcCancel}>
                            Página Inicial
                        </Button>
                        <Button variant="primary" onClick={funcNext}>
                            Edição de Endereços
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
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

function Error(){
    return(
        <h1>Error</h1>
    )
}
