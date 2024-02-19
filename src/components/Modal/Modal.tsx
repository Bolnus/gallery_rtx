import React from "react";
import {createPortal} from "react-dom";
import classes from "./modal.module.scss"
import {onSimpleDispatchClicked} from "../../utils/commonUtils";

export enum ModalType
{
    DeleteDialog = 0,
    Info = 1
}

export interface ModalProps
{
    onClose: Function
    modalType: ModalType
    header: string
    onOk?: Function
}

function onBackGroundClicked(onClose: Function, event: React.FormEvent)
{
    if (event.currentTarget !== event.target)
    {
        return;
    }
    onClose();
}

function onOkClicked(onOk: Function, onClose: Function)
{
    onOk();
    onClose();
}

export function Modal(props: ModalProps)
{
    const domNode = React.useRef<HTMLDivElement>(document.createElement("div"));

    React.useEffect(function()
    {
        const element = domNode.current;
        document.body.appendChild(element);
        element.className = classes.portal;
        return function()
        {
            document.body.removeChild(element);
        }
    })
    let modalContent = null;
    switch(props.modalType)
    {
    case ModalType.DeleteDialog:
        modalContent = (
            <>
                <button
                    className={`pushButton ${classes.modal__pb} ${classes.modal__pb_left} ${classes.modal__pb_normal}`}
                    onClick={onSimpleDispatchClicked.bind(null, props.onClose)}
                >
                    Отмена
                </button>
                <button
                    className={`pushButton ${classes.modal__pb} ${classes.modal__pb_right} ${classes.modal__pb_alert}`}
                    onClick={onOkClicked.bind(null, props.onOk as Function, props.onClose)}
                >
                    Да
                </button>
            </>
        );
        break;
    case ModalType.Info:
        modalContent = (
            <>
                <button
                    className={`pushButton ${classes.modal__pb} ${classes.modal__pb_wide} ${classes.modal__pb_normal}`}
                    onClick={onSimpleDispatchClicked.bind(null, props.onClose)}
                >
                    Ок
                </button>
            </>
        );
        break;
    }

    return createPortal(
        <div
            onClick={onBackGroundClicked.bind(null,props.onClose)}
            className={classes.root}
        >
            <div className={classes.modal}>
                <h4>{props.header}</h4>
                {modalContent}
            </div>
        </div>,
        domNode.current
    );
}