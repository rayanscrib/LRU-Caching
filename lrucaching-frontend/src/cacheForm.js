import React, { useState } from 'react';
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
                alert('Key-Value pair set successfully!');
            } else if (operation === 'get') {
                // Get operation
                const response = await axios.get(`http://localhost:8080/girishLru/get/${key}`);
                setResult(response.data);
                if (!response.data.value) {
                    setError('Key either not found or removed due to LRU');
                }
            }
        } catch (error) {
            console.error("There was an error!", error);
            setError('Operation failed!');
        }
    };

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
                            <label htmlFor="timeout-input">Timeout (ms)</label>
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
                    {operation === 'set' ? 'Set Cache' : 'Get Cache'}
                </button>
            </form>

            {operation === 'get' && result && !error && (
                <div className="result-container">
                    <h3>Result:</h3>
                    <p><strong>Key:</strong> {key}</p>
                    <p><strong>Value:</strong> {result.value}</p>
                </div>
            )}

            {operation === 'get' && error && (
                <div className="result-container">
                    <h3>Error:</h3>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default CacheForm;
