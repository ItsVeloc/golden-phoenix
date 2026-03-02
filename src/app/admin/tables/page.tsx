'use client';

import { useEffect, useState } from 'react';
import type { Table } from '@/types';

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCapacity, setEditCapacity] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  async function fetchTables() {
    setLoading(true);
    try {
      const res = await fetch('/api/tables');
      const data = await res.json();
      setTables(data.tables || []);
    } catch {
      console.error('Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  }

  async function addTable(e: React.FormEvent) {
    e.preventDefault();
    if (!newName || !newCapacity) return;
    await fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, capacity: parseInt(newCapacity) }),
    });
    setNewName('');
    setNewCapacity('');
    fetchTables();
  }

  async function toggleActive(table: Table) {
    await fetch(`/api/tables/${table.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !table.is_active }),
    });
    fetchTables();
  }

  async function saveEdit(id: number) {
    await fetch(`/api/tables/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editName,
        capacity: parseInt(editCapacity),
      }),
    });
    setEditingId(null);
    fetchTables();
  }

  async function deleteTable(id: number) {
    if (!confirm('Delete this table? Only possible if no future bookings are assigned.')) return;
    const res = await fetch(`/api/tables/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Failed to delete table');
      return;
    }
    fetchTables();
  }

  function startEdit(table: Table) {
    setEditingId(table.id);
    setEditName(table.name);
    setEditCapacity(table.capacity.toString());
  }

  return (
    <>
      <h1>Tables</h1>

      <form className="admin-form" onSubmit={addTable}>
        <label>
          Name
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Table 9"
          />
        </label>
        <label>
          Capacity
          <input
            type="number"
            min="1"
            value={newCapacity}
            onChange={(e) => setNewCapacity(e.target.value)}
            placeholder="4"
          />
        </label>
        <button type="submit" className="admin-btn admin-btn-primary">
          Add Table
        </button>
      </form>

      {loading ? (
        <p style={{ color: 'var(--cream-dim)' }}>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((t) => (
              <tr key={t.id}>
                <td>
                  {editingId === t.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{
                        background: 'var(--charcoal)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--cream)',
                        padding: '4px 8px',
                        fontFamily: 'var(--sans)',
                        fontSize: '13px',
                        width: '120px',
                      }}
                    />
                  ) : (
                    t.name
                  )}
                </td>
                <td>
                  {editingId === t.id ? (
                    <input
                      type="number"
                      min="1"
                      value={editCapacity}
                      onChange={(e) => setEditCapacity(e.target.value)}
                      style={{
                        background: 'var(--charcoal)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--cream)',
                        padding: '4px 8px',
                        fontFamily: 'var(--sans)',
                        fontSize: '13px',
                        width: '60px',
                      }}
                    />
                  ) : (
                    t.capacity
                  )}
                </td>
                <td>
                  <button
                    className={`toggle-btn ${t.is_active ? 'active' : 'inactive'}`}
                    onClick={() => toggleActive(t)}
                  />
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  {editingId === t.id ? (
                    <>
                      <button
                        className="admin-btn admin-btn-primary"
                        onClick={() => saveEdit(t.id)}
                      >
                        Save
                      </button>
                      <button
                        className="admin-btn admin-btn-outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="admin-btn admin-btn-outline"
                        onClick={() => startEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => deleteTable(t.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
