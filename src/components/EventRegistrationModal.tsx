import { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onRegistrationSuccess: () => void;
}

export default function EventRegistrationModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onRegistrationSuccess,
}: EventRegistrationModalProps) {
  const [formData, setFormData] = useState({
    representative_ci: '',
    representative_name: '',
    student_ci: '',
    student_name: '',
    student_course: '',
  });
  const [showWarning, setShowWarning] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFirstSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(formData).some(value => !value.trim())) {
      alert('Por favor complete todos los campos');
      return;
    }

    setShowWarning(true);
  };

  const handleWarningConfirm = () => {
    setShowWarning(false);
    setShowSecondConfirm(true);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          representative_ci: formData.representative_ci,
          representative_name: formData.representative_name,
          student_ci: formData.student_ci,
          student_name: formData.student_name,
          student_course: formData.student_course,
        });

      if (insertError) throw insertError;

      const { error: updateError } = await supabase.rpc('increment_event_participants', {
        event_id_param: eventId,
      });

      if (updateError) {
        console.error('Error updating participant count:', updateError);
      }

      setShowSecondConfirm(false);
      setShowSuccess(true);
      onRegistrationSuccess();

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setFormData({
          representative_ci: '',
          representative_name: '',
          student_ci: '',
          student_name: '',
          student_course: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Error al enviar el registro. Por favor intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting && !showSuccess) {
      setShowWarning(false);
      setShowSecondConfirm(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            Registro para: {eventTitle}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={submitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {!showSuccess ? (
            <form onSubmit={handleFirstSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h3 className="font-semibold text-blue-800 mb-2">Datos del Representante Legal</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    C.I. del Representante *
                  </label>
                  <input
                    type="text"
                    name="representative_ci"
                    value={formData.representative_ci}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0123456789"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre y Apellido del Representante *
                  </label>
                  <input
                    type="text"
                    name="representative_name"
                    value={formData.representative_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan Pérez García"
                    required
                  />
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mt-6">
                  <h3 className="font-semibold text-green-800 mb-2">Datos del Estudiante</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    C.I. del Estudiante *
                  </label>
                  <input
                    type="text"
                    name="student_ci"
                    value={formData.student_ci}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0987654321"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre y Apellido del Estudiante *
                  </label>
                  <input
                    type="text"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="María Pérez López"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curso del Estudiante *
                  </label>
                  <input
                    type="text"
                    name="student_course"
                    value={formData.student_course}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="8vo A, 1ro BGU B, etc."
                    required
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>Información importante:</strong> Estos datos se recopilan temporalmente solo para verificar si coinciden con los registros de la institución. Si todo está correcto, en 2 o 3 días laborables se entregará la invitación al estudiante, la cual deberá presentar el representante al ingresar al plantel.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Enviar Registro
              </button>
            </form>
          ) : (
            <div className="py-12 text-center">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Datos enviados</h3>
              <p className="text-gray-600">
                Sea paciente mientras se procesa la verificación.
              </p>
            </div>
          )}
        </div>
      </div>

      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Advertencia
                </h3>
                <p className="text-gray-600">
                  Antes de terminar el proceso, revise que todos los datos sean correctos. Si hay errores, es probable que no llegue la invitación.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleWarningConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showSecondConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirmación Final
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Está seguro de que desea enviar estos datos? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSecondConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
