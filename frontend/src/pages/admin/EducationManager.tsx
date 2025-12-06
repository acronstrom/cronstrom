import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, GraduationCap, Calendar } from 'lucide-react';
import { educationHistory, courses } from '../../lib/data';

export function EducationManager() {
  const [educationList] = useState(educationHistory);
  const [courseList] = useState(courses);

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-neutral-500 hover:text-neutral-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-serif">Hantera Utbildning</h1>
          </div>
          <button className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm hover:bg-neutral-800 transition-colors">
            <Plus className="w-4 h-4" />
            Lägg till
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Education History */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-medium flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Utbildningshistorik
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              {educationList.length} utbildningar
            </p>
          </div>

          <div className="divide-y divide-neutral-100">
            {educationList.map((edu) => (
              <div key={edu.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{edu.institution}</h3>
                    <p className="text-sm text-neutral-600">{edu.degree}</p>
                    <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {edu.year}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-medium">Kurser som erbjuds</h2>
            <p className="text-sm text-neutral-500 mt-1">
              {courseList.length} kurser
            </p>
          </div>

          <div className="divide-y divide-neutral-100">
            {courseList.map((course) => (
              <div key={course.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{course.title}</h3>
                    <p className="text-sm text-neutral-600">{course.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-neutral-500">
                      <span>Längd: {course.duration}</span>
                      <span>Max deltagare: {course.maxParticipants}</span>
                      <span className={course.available ? 'text-green-600' : 'text-neutral-400'}>
                        {course.available ? 'Tillgänglig' : 'Ej tillgänglig'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-neutral-500 text-sm">
          Obs: Ändringar sparas i demo-läge. Anslut MongoDB för permanent lagring.
        </p>
      </main>
    </div>
  );
}

