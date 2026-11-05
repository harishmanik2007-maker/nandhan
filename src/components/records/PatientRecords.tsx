import React, { useState } from 'react';
import { 
  FolderHeart, 
  Search, 
  Plus, 
  Edit3, 
  Eye, 
  UserCheck, 
  Calendar, 
  Bed, 
  Activity, 
  Clock, 
  X,
  Check,
  Filter
} from 'lucide-react';
import { useCardiac } from '../../context/CardiacContext';
import { Patient } from '../../types/cardiac';

export const PatientRecords: React.FC = () => {
  const { 
    patients, 
    setSelectedPatientId, 
    setActiveTab, 
    addPatient, 
    updatePatient 
  } = useCardiac();

  const [searchTerm, setSearchTerm] = useState('');
  const [wardFilter, setWardFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // New patient form state
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState(55);
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPatientBlood, setNewPatientBlood] = useState('O+');
  const [newPatientRoom, setNewPatientRoom] = useState('ICU-3');
  const [newPatientBed, setNewPatientBed] = useState('Bed 03');
  const [newPatientCondition, setNewPatientCondition] = useState('Post-Angioplasty Stent Surveillance');
  const [newPatientPhysician, setNewPatientPhysician] = useState('Dr. Sarah Chen, MD');
  const [newPatientHistory, setNewPatientHistory] = useState('Hypertension, Hyperlipidemia');
  const [newPatientInitialHr, setNewPatientInitialHr] = useState(74);

  // Filtered patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesWard = wardFilter === 'all' || p.room.startsWith(wardFilter);
    return matchesSearch && matchesWard;
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    addPatient({
      name: newPatientName.trim(),
      age: Number(newPatientAge),
      gender: newPatientGender,
      bloodType: newPatientBlood,
      room: newPatientRoom,
      bed: newPatientBed,
      admissionDate: new Date().toISOString().split('T')[0],
      condition: newPatientCondition.trim(),
      primaryPhysician: newPatientPhysician.trim(),
      medicalHistory: newPatientHistory.split(',').map(s => s.trim()).filter(Boolean),
      monitoringStatus: 'Active',
      initialHr: Number(newPatientInitialHr),
      initialSpo2: 98,
      initialTemp: 36.8,
    });

    setIsAddModalOpen(false);
    setNewPatientName('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;
    updatePatient(editingPatient);
    setEditingPatient(null);
  };

  const handleViewBedside = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('monitoring');
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hospital Patient Registry & Clinical Records
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-mono">
              Electronic Health Record
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized database of cardiology inpatients, assigned IoT telemetry nodes, and admission histories.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Add Demo Patient
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, or clinical diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Ward:
          </span>
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="all">All Wards</option>
            <option value="ICU">Intensive Care (ICU)</option>
            <option value="CCU">Coronary Care (CCU)</option>
            <option value="CAR">Cardiology Step-down (CAR)</option>
            <option value="OBS">Observation (OBS)</option>
            <option value="GEN">General Ward (GEN)</option>
          </select>
        </div>
      </div>

      {/* Patients Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Patient ID & Name</th>
                <th className="py-3 px-3">Demographics</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Primary Diagnosis</th>
                <th className="py-3 px-3">Attending Physician</th>
                <th className="py-3 px-3">IoT Node</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{patient.name}</div>
                    <div className="font-mono text-[11px] text-slate-500">{patient.id}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-slate-800">{patient.age} yrs · {patient.gender}</div>
                    <div className="text-[11px] text-slate-400">Blood: {patient.bloodType}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800">{patient.room}</div>
                    <div className="text-[11px] text-slate-400">{patient.bed}</div>
                  </td>

                  <td className="py-3 px-3 max-w-xs">
                    <div className="font-medium text-slate-800 truncate" title={patient.condition}>
                      {patient.condition}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      History: {patient.medicalHistory.join(', ')}
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                    {patient.primaryPhysician}
                  </td>

                  <td className="py-3 px-3">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                      {patient.assignedDeviceId}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {patient.monitoringStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleViewBedside(patient.id)}
                        className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors"
                        title="View Bedside Telemetry"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingPatient(patient)}
                        className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded transition-colors"
                        title="Edit Patient Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Demo Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Register New Inpatient</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Edwards"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={newPatientBlood}
                    onChange={(e) => setNewPatientBlood(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ward / Room</label>
                  <input
                    type="text"
                    value={newPatientRoom}
                    onChange={(e) => setNewPatientRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bed Number</label>
                  <input
                    type="text"
                    value={newPatientBed}
                    onChange={(e) => setNewPatientBed(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Clinical Diagnosis</label>
                <input
                  type="text"
                  value={newPatientCondition}
                  onChange={(e) => setNewPatientCondition(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Physician</label>
                <input
                  type="text"
                  value={newPatientPhysician}
                  onChange={(e) => setNewPatientPhysician(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relevant Medical History (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Diabetes, Smoker"
                  value={newPatientHistory}
                  onChange={(e) => setNewPatientHistory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg min-h-[40px] shadow-xs"
                >
                  Save & Assign ESP32
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit Patient Record ({editingPatient.id})
              </h3>
              <button onClick={() => setEditingPatient(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingPatient.name}
                  onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Room</label>
                  <input
                    type="text"
                    value={editingPatient.room}
                    onChange={(e) => setEditingPatient({ ...editingPatient, room: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bed</label>
                  <input
                    type="text"
                    value={editingPatient.bed}
                    onChange={(e) => setEditingPatient({ ...editingPatient, bed: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis</label>
                <input
                  type="text"
                  value={editingPatient.condition}
                  onChange={(e) => setEditingPatient({ ...editingPatient, condition: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Physician</label>
                <input
                  type="text"
                  value={editingPatient.primaryPhysician}
                  onChange={(e) => setEditingPatient({ ...editingPatient, primaryPhysician: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg min-h-[40px] shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
