import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

const CacheForm = () => {
    const [operation, setOperation] = useState('set');
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [timeout, setTimeout] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setResult(null);
        setError(null);
    
        try {
            if (operation === 'set') {
                // Set operation
                await axios.post('http://localhost:8080/girishLru/setKey', {
                    key: key,
                    value: value,
                    timeout: timeout,
                });
                setResult({ success: true, message: 'Key-Value pair set successfully!' });
            } else if (operation === 'get') {
                // Get operation
                const response = await axios.get(`http://localhost:8080/girishLru/get/${key}`);
                setResult(response.data);
                if (!response.data.value) {
                    setError('Key either not found or removed due to LRU');
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('Key not found or may have expired');
            } else {
                console.error("There was an error!", error);
                setError('Operation failed!');
            }
        }
    };

    useEffect(() => {
        //Here I am resetting the result-continer for every get or for every key entry
        if (operation === 'get') {
            setResult(null);
        }
    }, [key, operation]);

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="operation-select">Operation</label>
                    <select
                        id="operation-select"
                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                        className="form-select"
                    >
                        <option value="set">Set</option>
                        <option value="get">Get</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="key-input">Key</label>
                    <input
                        type="text"
                        id="key-input"
                        placeholder="Enter Key"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>

                {operation === 'set' && (
                    <>
                        <div className="form-group">
                            <label htmlFor="value-input">Value</label>
                            <input
                                type="text"
                                id="value-input"
                                placeholder="Enter Value"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="timeout-input">Timeout (seconds)</label>
                            <input
                                type="number"
                                id="timeout-input"
                                placeholder="Enter Timeout"
                                value={timeout}
                                onChange={(e) => setTimeout(parseInt(e.target.value))}
                                required
                                className="form-input"
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="form-button">
                    {operation === 'set' ? 'Set cache' : 'Get cache'}
                </button>
            </form>

            {error && (
                <div className="error-container">
                    <h3>Error:</h3>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="result-container">
                    <h3>Result:</h3>
                    {result.success ? (
                        <p>{result.message}</p>
                    ) : (
                        <>
                            <p><strong>Key:</strong> {key}</p>
                            <p><strong>Value:</strong> {result.value}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CacheForm;
