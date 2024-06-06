import React from 'react'
import { P, Switch } from '@salutejs/plasma-ui'
import { useState } from 'react'
import { useEffect } from 'react';


function SwitchTest() {
    const [s, setS] = useState(true);
useEffect(() => {
    console.log()
}, [s])
  return (
    <div>
        <Switch
            value={s}
            onChange={() => {setS(!s)}}
            checked={s}
        ></Switch>
        <div>
            State:
            {
                s ?
                <p>On</p>
                :
                <p>Off</p>
            }
        </div>
        <button onClick={() => {setS(!s)}}>
            change value
        </button>
    </div>
  )
}

export default SwitchTest

{
    /*
    label	ReactNode		
Метка-подпись к элементу

name	string		
Определяет уникальное имя элемента формы

id	string		
Уникальный идентификатор контрола

onFocus	FocusEventHandler<HTMLInputElement>		
Обработчик фокуса на элементе формы

onBlur	FocusEventHandler<HTMLInputElement>		
Обработчик блюра на элементе формы

onChange	ChangeEventHandler<HTMLInputElement>		
Обработчик изменения элемента формы

disabled	boolean		
Компонент неактивен

value	string | number | readonly string[]		
Определяет значение элемента формы

checked	boolean		
Помечен ли заранее такой элемент формы, как флажок или переключатель

readOnly	boolean		
Элемент формы не может изменяться пользователем

focused	boolean		
Компонент в фокусе

outlined	boolean		
Добавить рамку при фокусе

description	ReactNode		
Описание элемента

pressed	boolean		
    */
}