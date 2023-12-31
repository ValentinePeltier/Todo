import {useLocalStorage} from "../hooks/useLocalStorage";
import {useState} from "react";
import {TodoItem} from "./todoItem";

export type TTodoItem = {
    id: string,
    text: string,
    done: boolean,
}
enum EItemFilter {
    ALL = 'all',
    ACTIVE= 'active',
    COMPLETE = 'complete',
}
export const TodoList = () => {
    const [newTodo, setNewTodo] = useState({text:'', done:false});
    const [items, setItems] = useLocalStorage('todoAppItemsList', []);
    const [itemFilter, setItemFilter] = useState(EItemFilter.ALL);

    const handleItemToggleCheck = (itemToToggle: TTodoItem) => {
        setItems((items:TTodoItem[]) => items.map((item) =>
            item.id === itemToToggle.id ? {...item , done: !item.done} : item
        ));
    }

    const handleDeleteItem = (itemToDelete: TTodoItem) => {
        setItems((items:TTodoItem[]) => items.filter(({id})=> id !== itemToDelete.id))
    }
    const addItemToList = (newItem: { text:string, done:boolean }) => {
        if(newItem.text) {
            crypto.randomUUID();
            setItems((items: TTodoItem[]) => [...items, {
                id: crypto.randomUUID(),
                text: newItem.text,
                done: newItem.done
            }])
        }
    }
    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addItemToList(newTodo);
            setNewTodo({text:'', done: false});
        }
    }

    const nbItemNotDone = () => {
        let totalNotDone = 0;
        items.forEach((item:TTodoItem) => {if(!item.done) totalNotDone += 1; });

        return `${totalNotDone} ${totalNotDone > 1 ? 'items left': 'item left'}`
    }

    const handleClearCompleteItem= () => {
        setItems((items:TTodoItem[]) => items.filter(({done})=> !done))
    }

    return (
        <>
            <div className={'container'}>
                <div className={'todoItem'}>
                    <div className={'todoCheck'}>
                        <input id={'newItemCheck'} type={"checkbox"} checked={newTodo.done} onChange={() => setNewTodo(newTodoItem => {return{ ...newTodoItem, done:!newTodoItem.done}})}/>
                        <span className="checkmark" onClick={() => setNewTodo(newTodoItem => {return{ ...newTodoItem, done:!newTodoItem.done}})}></span>
                        <input placeholder={'To do.....'} value={newTodo.text} onChange={event => setNewTodo(newTodoItem => {return{ ...newTodoItem, text:event.target.value}})} onKeyUp={(e) =>handleKeyUp(e)} />
                    </div>
                    <button onClick={() => {addItemToList(newTodo); setNewTodo({text:'', done:false})}}>+</button>
                </div>
            </div>
            <div className={'container'}>
                <ul>
                    { items.filter((item:TTodoItem)=> {
                        if(itemFilter === EItemFilter.COMPLETE) return item.done;
                        if(itemFilter === EItemFilter.ACTIVE) return !item.done;
                        return true
                    }).map((item:TTodoItem) => {
                        return (
                        <li key={item.id}>
                            <TodoItem item={item}
                                      onItemToggleCheck={handleItemToggleCheck}
                                      onItemDeletion={handleDeleteItem}
                            />
                        </li>
                        )
                    })}
                </ul>
                <div className={'list_footer'}>
                    <p>{nbItemNotDone()}</p>
                    <div className={'list_footer_filter'}>
                        <button className={itemFilter === EItemFilter.ALL ? 'active': ''} onClick={()=>setItemFilter(EItemFilter.ALL)}>All</button>
                        <button className={itemFilter === EItemFilter.ACTIVE ? 'active': ''} onClick={()=>setItemFilter(EItemFilter.ACTIVE)}>Active</button>
                        <button className={itemFilter === EItemFilter.COMPLETE ? 'active': ''} onClick={()=>setItemFilter(EItemFilter.COMPLETE)}>Complete</button>
                    </div>
                    <button onClick={handleClearCompleteItem}>Clear Complete</button>
                </div>
            </div>
        </>
    );

}