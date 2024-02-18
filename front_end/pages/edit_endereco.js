import React, {useState} from "react";
import { useRouter } from "next/router";
import styles from '../styles/edit_contacts.module.css'
import {notification, message} from 'antd'

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function EditContacts(){

    const router = useRouter()
    const { id } = router.query
    console.log(`id: ${id}`)

    const [objEndereco, setEndereco] = useState({
        rua: '',
        bairro: '',
        cidade: '',
        num: '',
        status: 'load'
    })

    /*
    const [objTelefone, setTelefone] = useState({
        dados: undefined,
        status: 'load'
    })*/

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


    /*
    const renderTooltipTell = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Adicione um novo número
        </Tooltip>
    );*/

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Adicione um Endereço
        </Tooltip>
    );

    /* 
    if(editData.statusCont && (editData.statusEnd || objEndereco.rua == undefined)){
        console.log('entrou no if dos caminhos')
        
        if(destino == 'voltar'){
            openMessage()
            setTimeout(function () {
                router.push({
                    pathname: './contacts'
                })
            }, 1500);
        }
        else if(destino == 'editar'){
            router.push({
                pathname: './edit_phone',
                query: {id: id, num: num, idNum: idNum}
            })
        }
        else{
            //console.log('chama a pag de criar')
            router.push({
                pathname: './create_phone',
                query: {id: id}
            })
        }
    }
    */

    /*
    const [editData, setEditData] = useState({
        statusCont: false,
        statusEnd: false,
        destino: '',
        id: undefined,
        num: '',
        idPhone: undefined,
    })

    console.log(editData)

    if(editData.statusCont && (editData.statusEnd || objEndereco.rua == undefined)){
        //console.log('entrou no if dos caminhos')
        
        console.log(editData.destino)
        console.log(editData.num)
        console.log(editData.idPhone)

        if(editData.destino == 'voltar'){
            openMessage()
            setTimeout(function () {
                router.push({
                    pathname: './contacts'
                })
            }, 1500);
        }
        else if(editData.destino == 'editar'){
            router.push({
                pathname: './edit_phone',
                query: {id: editData.id, num: editData.num, idNum: editData.idPhone}
            })
        }
        else{
            //console.log('chama a pag de criar')
            router.push({
                pathname: './create_phone',
                query: {id: id}
            })
        }
    }*/
    

    const formatData = ({destino, num, idNum}) => {

        
        var dataEndereco = {
            contato: id,
            rua: undefined,
            bairro: undefined,
            cidade: undefined,
            num: undefined,
        };

        if(objEndereco.rua != undefined){
            dataEndereco = {
                contato: id,
                rua: document.getElementById('formGridRoad').value,
                bairro: document.getElementById('formGridReigh').value,
                cidade: document.getElementById('formGridCity').value,
                num: document.getElementById('formGridNumber').value,
            };
        }

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

        /*
        if(ok && objEndereco.rua != undefined){
            console.log('entrou no try do endereço')
            try{
                Object.keys(dataEndereco).forEach(key => {
                    console.log(dataEndereco[key])
                    if(!dataEndereco[key]){
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
        }*/
        
        //console.log(`ok? ${ok}`)
        if(ok){
            setEditData({
                statusCont: editData.statusCont,
                statusEnd: editData.statusEnd,
                destino: destino,
                id: id,
                num: num,
                idPhone: idNum,
            })

            if(!editData.statusCont){
                editaContato({objData: dataContato})
            }
            if(!editData.statusEnd && editData.statusCont && objEndereco.rua != undefined){
                //console.log('entrou para editar o endereco')
                editaEndereco({objData: dataEndereco})
            }
        }
    }

    /*
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

    const carregaTelefone = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/telefones/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                setTelefone({
                    dados: undefined,
                    status: 'erro'
                })
            }

            const data = await response.json();
            var filterData = data.filter(item => item.owner == id)
            console.log(filterData)
            setTelefone({
                dados: filterData,
                status: 'ok'
            })
            
        } catch (error) {
            console.log('entrou no erro de telefone')
            console.error('Erro na requisição da API:', error.message);
            setTelefone({
                dados: undefined,
                status: 'erro'
            })
        }
    }*/

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
                    rua: undefined,
                    bairro: undefined,
                    cidade: undefined,
                    num: undefined,
                    status: 'erro'
                })
            }

            const data = await response.json();
            var filterData = data.filter(item => item.contato == id)
            //console.log(`data do endereço: ${filterData.length}`)

            if(filterData.length != 0){
                setEndereco({
                    rua: filterData[0].rua,
                    bairro: filterData[0].bairro,
                    cidade: filterData[0].cidade,
                    num: filterData[0].num,
                    status: 'ok'
                })
            }
            else{
                setEndereco({
                    rua: undefined,
                    bairro: undefined,
                    cidade: undefined,
                    num: undefined,
                    status: 'not_exist'
                })
            }
        
        } catch (error) {
            console.error('Erro na requisição da API:', error.message);
            setEndereco({
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
        fetch(`http://127.0.0.1:8000/enderecos/${id}/`, {
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
            
        })
        .catch(error => {
            console.error('Erro durante a requisição POST:', error);
        });
    }

    const handleChangeRoad = (e) => {
        const inputText = e.target.value

        if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
            setEndereco({
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
                rua: objEndereco.rua,
                bairro: objEndereco.bairro,
                cidade: objEndereco.cidade,
                num: inputText,
                status: objEndereco.status
            })
        }
    }

    const cancelOperation = () => {
        openNotification({placement: 'topRight', title: 'Cancelamento', descricao: 'As Alterações Foram Canceladas!'})
        setTimeout(function () {
            router.push({
                pathname: './contacts'
            })
        }, 1500)
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
                objEndereco.status == 'not_exist'
                ?
                    <CreateEnd/>
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
    num
    }){

    return(
        <div className={styles.body}>
            {context01}
            {context02}
            <h1>Endereço</h1>
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
                <Button variant="success" size="sm" >
                    Salvar Alterações<span class="material-symbols-outlined">check</span>
                </Button>

                <Button variant="primary" size="sm">
                    Editar Telefone<span class="material-symbols-outlined">check</span>
                </Button>
    
                <Button variant="danger" size="sm">
                    Cancelar Alterações<span class="material-symbols-outlined">cancel</span>
                </Button>
            </div>
        </div>
    )
}

/* 
{
                objContato.status == 'load' || objTelefone.status == 'load' || objEndereco.status == 'load'
                ?
                    <Load/>
                :
                objContato.status == 'erro' || objTelefone.status == 'erro' || objEndereco.status == 'erro'
                ?
                    <Error/>
                :
                <Forms
                    context01={contextHolder}
                    context02={contextHolder2}
                    changeName={handleChangeName}
                    changeEmail={handleChangeEmail}
                    changeRoad={handleChangeRoad}
                    changeReigh={handleChangeReighborhood}
                    changeCity={handleChangeCity}
                    changeNumber={handleChangeNumber}
                    nome={objContato.nome}
                    email={objContato.email}
                    rua={objEndereco.rua}
                    bairro={objEndereco.bairro}
                    cidade={objEndereco.cidade}
                    num={objEndereco.num}
                    func={formatData}
                    funcRenderTell={renderTooltipTell}
                    funcRenderEnd={renderTooltipEnd}
                    objPhone={objTelefone.dados}
                    funcDeleteneNum={deleteNumber}
                    funcCancel={cancelOperation}
                />
            }
*/

/*
function Forms({
        context01, 
        context02, 
        changeName, 
        changeEmail, 
        changeRoad,
        changeReigh,
        changeCity,
        changeNumber,
        nome, 
        email,
        rua,
        bairro,
        cidade,
        num,
        func,
        funcRenderTell,
        funcRenderEnd,
        objPhone,
        funcDeleteneNum,
        funcCancel
    }){
    return(
        <div className={styles.body}>
            {context01}
            {context02}
            <h1>Página de Criar Contatos</h1>
            <hr></hr>
            <Container>
                <Row className={styles.rowTop}>
                    <Col className={styles.colOne}>
                        <h1 style={{fontWeight: '300'}}>Contato</h1>
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

                    <Col>
                        <h1 style={{fontWeight: '300', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            Telefones 
                            
                            <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={funcRenderTell}
                                >
                                <Button onClick={() => func({destino: 'criar', num: '', idNum: ''})} variant="success"><span class="material-symbols-outlined">add</span></Button>
                            </OverlayTrigger>
                        </h1>
                        <div className={styles.formTelefone}>
                            {
                                objPhone.map((item) => (
                                    <div>
                                        <div className={styles.numero}>{item.telefone}</div>

                                        <div className={styles.spanEdit}><span onClick={() => func({destino: 'editar', num: item.telefone, idNum: item.id})} class="material-symbols-outlined">edit</span></div>

                                        <div className={styles.spanDelete}><span onClick={() => funcDeleteneNum({idNumber: item.id})} class="material-symbols-outlined">delete</span></div>
                                    </div>
                                ))
                            }
                        </div>
                    </Col>
                </Row>

                <Row>
                    <h1 style={{fontWeight: '300'}}>Endereço</h1>
                    {
                        rua == undefined
                        ?
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
                        :
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
                    }
                    
                </Row>
            </Container>
            <div className={styles.contButtons}>
                <Button variant="success" size="sm" onClick={() => func({destino: 'voltar', num: '', idNum: ''})}>
                    Salvar Alterações<span class="material-symbols-outlined">check</span>
                </Button>
    
                <Button variant="danger" size="sm" onClick={funcCancel}>
                    Cancelar Alterações<span class="material-symbols-outlined">cancel</span>
                </Button>
            </div>
        </div>
    )
}*/

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
