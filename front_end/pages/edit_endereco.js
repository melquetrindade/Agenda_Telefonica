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

    const [objEndereco, setEndereco] = useState({
        idEndereco: undefined,
        rua: '',
        bairro: '',
        cidade: '',
        num: '',
        status: 'load'
    })

    const [show, setShow] = useState({
        has_show: false,
        title: ''
    });

    const handleClose = () => setShow({
        has_show: false,
        title: ''
    });
    const handleShow = ({titulo}) => {
        setShow({
            has_show: true,
            title: titulo
        })
    };

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

    const formatData = () => {

        const dataEndereco = {
            contato: id,
            rua: document.getElementById('formGridRoad').value,
            bairro: document.getElementById('formGridReigh').value,
            cidade: document.getElementById('formGridCity').value,
            num: document.getElementById('formGridNumber').value,
        };

        var ok = true

        try{
            Object.keys(dataEndereco).forEach(key => {
                if(!dataEndereco[key]){
                    console.log(`entrou aqui: ${key}`)
                    ok = false
                    openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
                    throw new Error('StopIteration');
                    
                }
            });
        } catch(error){
            if (error.message !== 'StopIteration') {
                throw error;
            }
        }

        if(ok){
            if(objEndereco.idEndereco != undefined){
                editaEndereco({objData: dataEndereco})
            }
            else{
                criarEndereco({objData: dataEndereco})
            }
        }
    }
    
    const carregaEndereco = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/enderecos/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                setEndereco({
                    idEndereco: undefined,
                    rua: undefined,
                    bairro: undefined,
                    cidade: undefined,
                    num: undefined,
                    status: 'erro'
                })
            }

            const data = await response.json();
            var filterData = data.filter(item => item.contato == id)

            if(filterData.length != 0){
                setEndereco({
                    idEndereco: filterData[0].id,
                    rua: filterData[0].rua,
                    bairro: filterData[0].bairro,
                    cidade: filterData[0].cidade,
                    num: filterData[0].num,
                    status: 'ok'
                })
            }
            else{
                setEndereco({
                    idEndereco: undefined,
                    rua: '',
                    bairro: '',
                    cidade: '',
                    num: '',
                    status: 'not_exist'
                })
            }
        
        } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setEndereco({
                idEndereco: undefined,
                rua: undefined,
                bairro: undefined,
                cidade: undefined,
                num: undefined,
                status: 'erro'
            })
        }
    }

    if(objEndereco.status == 'load' && id != undefined){
        carregaEndereco()
    }

    const editaEndereco = async ({objData}) => {
        fetch(`http://127.0.0.1:8000/enderecos/${objEndereco.idEndereco}/`, {
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
            handleShow({titulo: 'Alterações realizadas com Sucesso'})
        })
        .catch(error => {
            console.error('Erro durante a requisição POST:', error);
        });
    }

    const criarEndereco = async ({objData}) => {
        fetch(`http://127.0.0.1:8000/enderecos/`, {
        method: 'POST',
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
            console.log('alterações realizadas com sucesso')
            handleShow({titulo: 'Endereço adicionado com Sucesso'})
        })
        .catch(error => {
            console.error('Erro durante a requisição POST:', error);
        });
    }

    const handleChangeRoad = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setEndereco({
                idEndereco: objEndereco.idEndereco,
                rua: inputText,
                bairro: objEndereco.bairro,
                cidade: objEndereco.cidade,
                num: objEndereco.num,
                status: objEndereco.status
            })
        }
    }

    const handleChangeReighborhood = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setEndereco({
                idEndereco: objEndereco.idEndereco,
                rua: objEndereco.rua,
                bairro: inputText,
                cidade: objEndereco.cidade,
                num: objEndereco.num,
                status: objEndereco.status
            })
        }
    }

    const handleChangeCity = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setEndereco({
                idEndereco: objEndereco.idEndereco,
                rua: objEndereco.rua,
                bairro: objEndereco.bairro,
                cidade: inputText,
                num: objEndereco.num,
                status: objEndereco.status
            })
        }
    }

    const handleChangeNumber = (e) => {
        const inputText = e.target.value

        if (/^[A-Z 0-9']+$/.test(inputText) || inputText === '') {
            setEndereco({
                idEndereco: objEndereco.idEndereco,
                rua: objEndereco.rua,
                bairro: objEndereco.bairro,
                cidade: objEndereco.cidade,
                num: inputText,
                status: objEndereco.status
            })
        }
    }

    const cancelOperation = () => {
        router.push({
            pathname: './contacts'
        })
    }

    const navTelefone = () => {
        router.push({
            pathname: './edit_phone',
            query: {id: id}
        })
    }

    const navContato = () => {
        router.push({
            pathname: './edit_contacts',
            query: {id: id}
        })
    }

    const navPagInitial = () => {
        router.push({
            pathname: './contacts',
        })
    }

    return(
        <main className={styles.main}>
            {
                objEndereco.status == 'load'
                ?
                    <Load/>
                :
                objEndereco.status == 'erro'
                ?
                    <Error/>
                :
                    <Forms
                        context01={contextHolder}
                        context02={contextHolder2}
                        changeCity={handleChangeCity}
                        changeReigh={handleChangeReighborhood}
                        changeRoad={handleChangeRoad}
                        changeNumber={handleChangeNumber}
                        cidade={objEndereco.cidade}
                        bairro={objEndereco.bairro}
                        rua={objEndereco.rua}
                        num={objEndereco.num}
                        status={objEndereco.status}
                        show={show}
                        funcHandleClose={handleClose}
                        funcCancel={cancelOperation}
                        funcNavCont={navContato}
                        funcNavTell={navTelefone}
                        navPagInicial={navPagInitial}
                        funcFormData={formatData}
                    />
            }
        </main>
    )
}

function CreateEnd(){
    return(
        <h1>Cria um endereço</h1>
    )

    /*
    <div className={styles.criarEndereco}>
                                <h1>O Contato ainda não possui endereço. Adicione um Novo!</h1>
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={funcRenderEnd}
                                    >
                                    <Button onClick={() => func({destino: 'criar', num: '', idNum: ''})} variant="success"><span class="material-symbols-outlined">add</span></Button>
                                </OverlayTrigger>
                            </div>
    */
}

function Forms({
    context01, 
    context02, 
    changeCity, 
    cidade, 
    changeReigh,
    bairro,
    changeRoad,
    rua,
    changeNumber,
    num,
    status,
    show,
    funcHandleClose,
    funcCancel,
    funcNavCont,
    funcNavTell,
    navPagInicial,
    funcFormData
    }){

    return(
        <div className={styles.body}>
            {context01}
            {context02}
            <h1>Endereço</h1>
            {
                status == 'not_exist'
                ?
                    <p>O contato não possui Endereço. Adicione um Agora!</p>
                :
                    null
            }
            <hr></hr>
            <Container>
                <Row>
                    <Form className={styles.formEndereco}>
                        <Row>
                            <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>Cidade</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Rio de Janeiro" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeCity}
                                value={cidade}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} controlId="formGridReigh">
                            <Form.Label>Bairro</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Centro" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeReigh}
                                value={bairro}
                            />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} controlId="formGridRoad">
                            <Form.Label>Rua</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="7 de Setembro" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeRoad}
                                value={rua}
                            />
                            </Form.Group>
    
                            <Form.Group as={Col} controlId="formGridNumber">
                            <Form.Label>Nº</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="10" 
                                required 
                                minLength="1" 
                                maxlength="250"
                                onChange={changeNumber}
                                value={num}
                            />
                            </Form.Group>
                        </Row>
                    </Form>
                </Row>

            </Container>
            <div className={styles.contButtons}>
                {
                    status == 'not_exist'
                    ?
                    <Button variant="success" size="sm" onClick={funcFormData}>
                        Adicionar Endereço<span class="material-symbols-outlined">check</span>
                    </Button>
                    :
                    <Button variant="success" size="sm" onClick={funcFormData}>
                        Salvar Alterações<span class="material-symbols-outlined">check</span>
                    </Button>
                }
    
                <Button variant="primary" size="sm" onClick={funcNavTell}>
                    Editar Telefones<span class="material-symbols-outlined">navigate_next</span>
                </Button>

                <Button variant="danger" size="sm" onClick={funcCancel}>
                    Cancelar Alterações<span class="material-symbols-outlined">cancel</span>
                </Button>

                <Modal
                    show={show.has_show}
                    onHide={funcHandleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{show.title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Para onde deseja ser redirecionado?
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={navPagInicial}>
                            Página Inicial
                        </Button>
                        <Button variant="primary" onClick={funcNavCont}>
                            Edição de Contatos
                        </Button>
                        <Button variant="primary" onClick={funcNavTell}>
                            Edição de Telefones
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
