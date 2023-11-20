import React, { useState } from "react";

export const Test: React.FC = () => {
    const [count, setCount] = useState(0);

    return (
        <>
            <p>Hello world</p>
            <p>{count}</p>
            <button onClick={() => setCount((c) => c + 1)}>Click ME!</button>
        </>
    );
};
