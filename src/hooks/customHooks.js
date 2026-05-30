import { useEffect, useState } from "react";

const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        const saved = localStorage.getItem(key);
        if (saved === null) return initialValue;
        try {
            return JSON.parse(saved);
        }
        catch {
            return saved;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}

const useDataManager = (key, initialValue = []) => {
    // Date
    const [data, setData] = useLocalStorage(key, initialValue);

    // Operations
    const add = (newItem) => {
        setData(prev => {
            const newId = (prev.length > 0 ? Math.max(...prev.map(prevItem => prevItem.id)) : 0) + 1;
            return [
                ...prev,
                {
                    ...newItem,
                    id: newId,
                }
            ]
        });
    }

    const remove = (id) => {
        setData(prev =>
            prev.filter(prevItem =>
                prevItem.id !== id
            )
        );
    }

    const removeAllWhere = (conditionCallback) => {
        setData(prev =>
            prev.filter(prevItem => !conditionCallback(prevItem))
        );
    }

    const clear = () => {
        setData(() => initialValue);
    }

    const edit = (id, newValues) => {
        setData(
            prev => prev.map(prevItem =>
                prevItem.id === id ?
                    {
                        ...prevItem,
                        ...newValues,
                    }
                    : prevItem
            )
        );
    }

    const editAllWhere = (conditionCallback, newValues) => {
        const safeValues = { ...newValues };
        delete safeValues.id;
        setData(prev =>
            prev.map(prevItem => conditionCallback(prevItem) ?
                {
                    ...prevItem,
                    ...safeValues,
                }
                : prevItem
            )
        );
    }

    const changeOrder = (from, to) => {
        setData(prev => {
            const newData = [...prev];
            const [fromItem] = newData.splice(from, 1);
            newData.splice(to, 0, fromItem);
            return newData;
        });
    }

    const sort = (sortCallback = () => {}, reverseCheck = true) => {
        setData(prev => {
                const newData = [...prev];
                newData.sort((item1, item2) => sortCallback(item1, item2));
                if (newData.every((item, index) => item.id === prev[index].id)) {
                    if (reverseCheck) newData.reverse();
                    else return prev;
                }
                return newData;
            }
        );
    }

    const overWrite = (newData) => {
        setData(newData);
    }

    const merge = (newData, keyItems = ['id']) => {
        if (!keyItems.includes('id')) keyItems.unshift('id');
        setData(prev => {
            const filteredNewData = newData.filter(newItem =>
                !prev.find(prevItem =>
                    keyItems.some(key => prevItem[key] === newItem[key])
                )
            );
            return [
                ...prev,
                ...filteredNewData,
            ]
        });
    }

    return [data, {
        add,
        remove,
        removeAllWhere,
        clear,
        edit,
        editAllWhere,
        changeOrder,
        sort,
        overWrite,
        merge,
    }];
}

const useStateManager = (initialState) => {
    const [state, setState] = useState(initialState);

    const set = (key, newValue) => {
        setState(prev => {
            return {
                ...prev,
                [key]: newValue,
            };
        });
    }

    const toggle = (key) => {
        setState(prev => {
            return {
                ...prev,
                [key]: !prev[key],
            }
        });
    }

    const reset = (key) => {
        setState(prev => {
            return {
                ...prev,
                [key]: initialState[key],
            }
        });
    }

    const resetAll = () => {
        setState(initialState);
    }

    const resetWhere = (callback = () => {}) => {
        setState(prev => {
            const newState = {};
            Object.keys(prev).forEach(key => {
                newState[key] = callback(prev[key]) ? initialState[key] : prev[key];
            });
            return newState;
        });
    }

    const resetExcept = (...items) => {
        setState(prev => {
            const newState = {};
            Object.keys(prev).forEach(key => {
                newState[key] = items.includes(key) ? prev[key] : initialState[key];
            });
            return newState;
        });
    }

    return [state, {
        set,
        toggle,
        reset,
        resetAll,
        resetWhere,
        resetExcept,
    }];
}

export {
    useLocalStorage,
    useDataManager,
    useStateManager,
};