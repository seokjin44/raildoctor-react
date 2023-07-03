import React, { useState } from 'react';
import ModalView from './ModalView';
import './Modal.css';
import ShortTermInstrumentation from "../Instrumentation/ShortTermInstrumentation";
import Wear3D from "../Wear3D/Wear3D";


const Modal = (props) => {
    // useState를 사용하여 open상태를 변경한다. (open일때 true로 만들어 열리는 방식)
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <React.Fragment>
            <button className="modalButton" onClick={openModal}>{props.buttonLabel}</button>
            <ModalView open={modalOpen} close={closeModal} header={props.title}>
                {
                    // ModalView.js {props.children} </main>에 내용이 입력된다. 리액트 함수형 모달
                    <Wear3D data={props.data}></Wear3D>
                }
            </ModalView>
        </React.Fragment>
    );
}

export default Modal;