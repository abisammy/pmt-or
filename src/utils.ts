export const getId = (string: string, ...prefix: string[]) => {
    return prefix.join() + string.toLowerCase().replace(/[ +]/g, "");
};

type Element = keyof HTMLElementTagNameMap;
type ElementFromId<T extends Element> = HTMLElementTagNameMap[T];

type ElementCallback<T extends Element> = (element: ElementFromId<T>) => void;

export const addElement = <T extends Element>(
    type: T,
    parent: Node,
    callback?: ElementCallback<T>
): ElementFromId<T> => {
    const element = document.createElement(type);
    if (callback) callback(element);
    parent.appendChild(element);
    return element;
};

export const addHTMLButton = (parent: Node, text: string, callback?: ElementCallback<"button">) =>
    addElement("button", parent, (button) => {
        button.innerHTML = text;
        if (callback) callback(button);
    });

export const addHTMLOption = (parent: Node, text: string, value: string, callback?: ElementCallback<"option">) =>
    addElement("option", parent, (option) => {
        option.text = text;
        option.value = value;
        if (callback) callback(option);
    });

export const addHTMLHeading = (parent: Node, text: string, callback?: ElementCallback<"h2">) =>
    addElement("h2", parent, (heading) => {
        heading.innerText = text;
        if (callback) callback(heading);
    });
