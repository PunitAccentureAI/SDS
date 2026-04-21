import React, { useState, useRef, useEffect } from 'react';
import './DatePicker.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date) {
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function DatePicker({ label, value, onChange, onlyToday = false }) {
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value ? value.getFullYear() : todayYear);
  const [viewMonth, setViewMonth] = useState(value ? value.getMonth() : todayMonth);
  const [selectedDate, setSelectedDate] = useState(
    value || (onlyToday ? new Date(todayYear, todayMonth, todayDay) : null),
  );
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setViewYear(value.getFullYear());
      setViewMonth(value.getMonth());
      return;
    }
    if (onlyToday) {
      setSelectedDate(new Date(todayYear, todayMonth, todayDay));
      setViewYear(todayYear);
      setViewMonth(todayMonth);
    }
  }, [onlyToday, todayDay, todayMonth, todayYear, value]);

  const prevMonth = () => {
    if (onlyToday) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (onlyToday) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDayClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    if (onlyToday && (viewYear !== todayYear || viewMonth !== todayMonth || day !== todayDay)) return;
    setSelectedDate(new Date(viewYear, viewMonth, day));
  };

  const handleApply = () => {
    if (selectedDate) {
      onChange(selectedDate);
    }
    setOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const prevMonthDays = getDaysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);

  const calendarDays = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({ day: d, isCurrentMonth: true });
  }

  const remaining = 7 - (calendarDays.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      calendarDays.push({ day: d, isCurrentMonth: false });
    }
  }

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const isSelected = (day, isCurrentMonth) => {
    if (!selectedDate || !isCurrentMonth) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
    );
  };

  const isDisabled = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return true;
    if (!onlyToday) return false;
    return viewYear !== todayYear || viewMonth !== todayMonth || day !== todayDay;
  };

  return (
    <div className="dp-wrapper" ref={ref}>
      <div
        className={`dp-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className={value ? 'dp-value' : 'dp-placeholder'}>
          {value ? formatDate(value) : 'Select date'}
        </span>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="dp-calendar-icon">
          <rect x="2" y="3" width="16" height="15" rx="2" stroke="#1d1d1f" strokeWidth="1.5" fill="none" />
          <line x1="2" y1="8" x2="18" y2="8" stroke="#1d1d1f" strokeWidth="1.5" />
          <line x1="6" y1="1" x2="6" y2="5" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="1" x2="14" y2="5" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {open && (
        <div className="dp-dropdown">
          <div className="dp-calendar">
            <div className="dp-header">
              <button type="button" className="dp-nav-btn" onClick={prevMonth} aria-label="Previous month">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 15l-5-5 5-5" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="dp-month-label">{MONTHS[viewMonth]} {viewYear}</span>
              <button type="button" className="dp-nav-btn" onClick={nextMonth} aria-label="Next month">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8 5l5 5-5 5" stroke="#1d1d1f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="dp-day-headers">
              {DAYS.map((d) => (
                <div key={d} className="dp-day-header">{d}</div>
              ))}
            </div>

            {weeks.map((week, wi) => (
              <div key={wi} className="dp-week-row">
                {week.map((cell, ci) => (
                  <button
                    key={ci}
                    type="button"
                    className={`dp-day-cell${cell.isCurrentMonth ? '' : ' other-month'}${isSelected(cell.day, cell.isCurrentMonth) ? ' selected' : ''}${isDisabled(cell.day, cell.isCurrentMonth) ? ' disabled' : ''}`}
                    onClick={() => handleDayClick(cell.day, cell.isCurrentMonth)}
                    disabled={isDisabled(cell.day, cell.isCurrentMonth)}
                  >
                    {cell.day}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="dp-footer">
            <button type="button" className="dp-apply-btn" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
