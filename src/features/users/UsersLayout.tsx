import { Routes, Route } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';

export { UsersLayout };

function UsersLayout() {
    return (
        <div className="p-4">
            <div className="container">
                <Routes>
                    <Route index element={<List />} />
                    <Route path="add" element={<AddEdit />} />
                    <Route path="edit/:id" element={<AddEdit />} />
                </Routes>
            </div>
        </div>
    );
}
