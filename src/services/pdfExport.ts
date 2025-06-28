// PDF Export Service for comprehensive data export
export interface ExportData {
  books: any[];
  notes: any[];
  preferences: any;
  pomodoroSessions: any[];
  pomodoroTotal: string;
  settings: any;
  exportDate: string;
}

export class PDFExportService {
  static async exportToPDF(): Promise<void> {
    // Gather all user data
    const data: ExportData = {
      books: JSON.parse(localStorage.getItem('focusreads-books') || '[]'),
      notes: JSON.parse(localStorage.getItem('focusreads-notes') || '[]'),
      preferences: JSON.parse(localStorage.getItem('focusreads-preferences') || '{}'),
      pomodoroSessions: JSON.parse(localStorage.getItem('focusreads-pomodoro-sessions') || '[]'),
      pomodoroTotal: localStorage.getItem('focusreads-pomodoro-total') || '0',
      settings: {
        theme: localStorage.getItem('focusreads-theme') || 'serenityBlue',
        dark: localStorage.getItem('focusreads-dark') || 'false',
        background: localStorage.getItem('focusreads-background') || ''
      },
      exportDate: new Date().toISOString()
    };

    // Create HTML content for PDF
    const htmlContent = this.generateHTMLContent(data);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }

  private static generateHTMLContent(data: ExportData): string {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatTime = (dateString: string) => {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FocusReads Data Export</title>
    <style>
        @page {
            margin: 1in;
            size: letter;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
            margin: 0;
            padding: 0;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #4F46E5;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #4F46E5;
            font-size: 28px;
            margin: 0;
        }
        
        .header .subtitle {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
        }
        
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        .section-title {
            color: #4F46E5;
            font-size: 20px;
            font-weight: bold;
            border-bottom: 2px solid #E5E7EB;
            padding-bottom: 8px;
            margin-bottom: 20px;
        }
        
        .subsection {
            margin-bottom: 25px;
        }
        
        .subsection-title {
            color: #374151;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .book-item, .note-item, .session-item {
            background: #F9FAFB;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        
        .book-title {
            font-weight: bold;
            color: #1F2937;
            font-size: 16px;
        }
        
        .book-author {
            color: #6B7280;
            font-style: italic;
            margin-bottom: 8px;
        }
        
        .book-details {
            font-size: 14px;
            color: #4B5563;
        }
        
        .note-content {
            background: white;
            padding: 12px;
            border-radius: 6px;
            border-left: 4px solid #4F46E5;
            margin: 10px 0;
            font-style: italic;
        }
        
        .tags {
            margin-top: 10px;
        }
        
        .tag {
            display: inline-block;
            background: #4F46E5;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin-right: 5px;
            margin-bottom: 3px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .stat-card {
            background: #F3F4F6;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #4F46E5;
        }
        
        .stat-label {
            font-size: 14px;
            color: #6B7280;
            margin-top: 5px;
        }
        
        .preferences-list {
            list-style: none;
            padding: 0;
        }
        
        .preferences-list li {
            background: #EEF2FF;
            padding: 8px 12px;
            margin-bottom: 5px;
            border-radius: 6px;
            border-left: 3px solid #4F46E5;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            color: #6B7280;
            font-size: 12px;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .no-data {
            text-align: center;
            color: #9CA3AF;
            font-style: italic;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📚 FocusReads Data Export</h1>
        <div class="subtitle">Complete reading profile and activity summary</div>
        <div class="subtitle">Exported on ${formatDate(data.exportDate)} at ${formatTime(data.exportDate)}</div>
    </div>

    <!-- Summary Statistics -->
    <div class="section">
        <div class="section-title">📊 Reading Summary</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${data.books.length}</div>
                <div class="stat-label">Total Books</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.books.filter((b: any) => b.status === 'completed').length}</div>
                <div class="stat-label">Books Completed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.books.filter((b: any) => b.status === 'reading').length}</div>
                <div class="stat-label">Currently Reading</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.notes.length}</div>
                <div class="stat-label">Notes Created</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.pomodoroTotal}</div>
                <div class="stat-label">Focus Sessions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${data.pomodoroSessions.length}</div>
                <div class="stat-label">Total Sessions</div>
            </div>
        </div>
    </div>

    <!-- Reading Preferences -->
    <div class="section">
        <div class="section-title">🎯 Reading Preferences</div>
        
        ${data.preferences.genres ? `
        <div class="subsection">
            <div class="subsection-title">Favorite Genres</div>
            <ul class="preferences-list">
                ${data.preferences.genres.map((genre: string) => `<li>${genre}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        ${data.preferences.mood ? `
        <div class="subsection">
            <div class="subsection-title">Current Reading Mood</div>
            <div class="book-item">
                <strong>${data.preferences.mood.charAt(0).toUpperCase() + data.preferences.mood.slice(1).replace('-', ' ')}</strong>
            </div>
        </div>
        ` : ''}
        
        ${data.preferences.readingGoals && data.preferences.readingGoals.length > 0 ? `
        <div class="subsection">
            <div class="subsection-title">Reading Goals</div>
            <ul class="preferences-list">
                ${data.preferences.readingGoals.map((goal: string) => `<li>${goal}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        
        ${data.preferences.readingTime ? `
        <div class="subsection">
            <div class="subsection-title">Typical Reading Time</div>
            <div class="book-item">
                <strong>${data.preferences.readingTime.replace('min', ' minutes').replace('hour', ' hour')}</strong>
            </div>
        </div>
        ` : ''}
        
        ${data.preferences.preferredLength ? `
        <div class="subsection">
            <div class="subsection-title">Preferred Book Length</div>
            <div class="book-item">
                <strong>${data.preferences.preferredLength.charAt(0).toUpperCase() + data.preferences.preferredLength.slice(1).replace('-', ' ')} reads</strong>
            </div>
        </div>
        ` : ''}
    </div>

    <!-- My Books -->
    <div class="section page-break">
        <div class="section-title">📚 My Books (${data.books.length})</div>
        
        ${data.books.length > 0 ? `
        <div class="subsection">
            <div class="subsection-title">Currently Reading (${data.books.filter((b: any) => b.status === 'reading').length})</div>
            ${data.books.filter((b: any) => b.status === 'reading').map((book: any) => `
                <div class="book-item">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                    <div class="book-details">
                        ${book.genre ? `Genre: ${book.genre} • ` : ''}
                        ${book.dateAdded ? `Added: ${formatDate(book.dateAdded)}` : ''}
                        ${book.isbn ? ` • ISBN: ${book.isbn}` : ''}
                    </div>
                    ${book.description ? `<div style="margin-top: 8px; font-size: 14px;">${book.description}</div>` : ''}
                    ${book.tags && book.tags.length > 0 ? `
                        <div class="tags">
                            ${book.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('') || '<div class="no-data">No books currently being read</div>'}
        </div>
        
        <div class="subsection">
            <div class="subsection-title">Completed Books (${data.books.filter((b: any) => b.status === 'completed').length})</div>
            ${data.books.filter((b: any) => b.status === 'completed').map((book: any) => `
                <div class="book-item">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                    <div class="book-details">
                        ${book.genre ? `Genre: ${book.genre} • ` : ''}
                        ${book.dateAdded ? `Added: ${formatDate(book.dateAdded)}` : ''}
                        ${book.isbn ? ` • ISBN: ${book.isbn}` : ''}
                    </div>
                    ${book.description ? `<div style="margin-top: 8px; font-size: 14px;">${book.description}</div>` : ''}
                    ${book.tags && book.tags.length > 0 ? `
                        <div class="tags">
                            ${book.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('') || '<div class="no-data">No completed books yet</div>'}
        </div>
        
        <div class="subsection">
            <div class="subsection-title">Want to Read (${data.books.filter((b: any) => b.status === 'want-to-read').length})</div>
            ${data.books.filter((b: any) => b.status === 'want-to-read').map((book: any) => `
                <div class="book-item">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                    <div class="book-details">
                        ${book.genre ? `Genre: ${book.genre} • ` : ''}
                        ${book.dateAdded ? `Added: ${formatDate(book.dateAdded)}` : ''}
                        ${book.isbn ? ` • ISBN: ${book.isbn}` : ''}
                    </div>
                    ${book.description ? `<div style="margin-top: 8px; font-size: 14px;">${book.description}</div>` : ''}
                    ${book.tags && book.tags.length > 0 ? `
                        <div class="tags">
                            ${book.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('') || '<div class="no-data">No books in reading list</div>'}
        </div>
        ` : '<div class="no-data">No books in your library yet</div>'}
    </div>

    <!-- Notes -->
    <div class="section page-break">
        <div class="section-title">📝 Reading Notes (${data.notes.length})</div>
        ${data.notes.length > 0 ? data.notes.map((note: any) => {
            const book = data.books.find((b: any) => b.id === note.bookId);
            return `
                <div class="note-item">
                    <div class="subsection-title">${book ? book.title : 'Unknown Book'}</div>
                    ${book ? `<div class="book-author">by ${book.author}</div>` : ''}
                    <div class="note-content">${note.content}</div>
                    <div class="book-details">
                        Created: ${formatDate(note.createdAt)}
                        ${note.updatedAt !== note.createdAt ? ` • Updated: ${formatDate(note.updatedAt)}` : ''}
                    </div>
                    ${note.tags && note.tags.length > 0 ? `
                        <div class="tags">
                            ${note.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('') : '<div class="no-data">No reading notes created yet</div>'}
    </div>

    <!-- Focus Sessions -->
    <div class="section page-break">
        <div class="section-title">🎯 Focus Mode Activity</div>
        
        <div class="subsection">
            <div class="subsection-title">Session Summary</div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${data.pomodoroTotal}</div>
                    <div class="stat-label">Total Completed Sessions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.pomodoroSessions.filter((s: any) => s.type === 'focus').length}</div>
                    <div class="stat-label">Focus Sessions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.pomodoroSessions.filter((s: any) => s.type !== 'focus').length}</div>
                    <div class="stat-label">Break Sessions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${Math.round(data.pomodoroSessions.filter((s: any) => s.type === 'focus').length * 25 / 60 * 10) / 10}</div>
                    <div class="stat-label">Hours Focused</div>
                </div>
            </div>
        </div>
        
        ${data.pomodoroSessions.length > 0 ? `
        <div class="subsection">
            <div class="subsection-title">Recent Sessions</div>
            ${data.pomodoroSessions.slice(-10).reverse().map((session: any) => `
                <div class="session-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${session.type === 'focus' ? '🎯 Focus Session' : session.type === 'short-break' ? '☕ Short Break' : '🛋️ Long Break'}</strong>
                            <div class="book-details">
                                Started: ${formatDate(session.startTime)} at ${formatTime(session.startTime)}
                                ${session.endTime ? ` • Ended: ${formatTime(session.endTime)}` : ''}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: ${session.completed ? '#059669' : '#DC2626'}; font-weight: bold;">
                                ${session.completed ? '✅ Completed' : '❌ Incomplete'}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        ` : '<div class="no-data">No focus sessions recorded yet</div>'}
    </div>

    <!-- Settings & Preferences -->
    <div class="section">
        <div class="section-title">⚙️ App Settings</div>
        
        <div class="subsection">
            <div class="subsection-title">Theme & Appearance</div>
            <div class="book-item">
                <div class="book-details">
                    Theme: <strong>${data.settings.theme.charAt(0).toUpperCase() + data.settings.theme.slice(1).replace(/([A-Z])/g, ' $1')}</strong><br>
                    Dark Mode: <strong>${JSON.parse(data.settings.dark) ? 'Enabled' : 'Disabled'}</strong><br>
                    Custom Background: <strong>${data.settings.background ? 'Set' : 'None'}</strong>
                </div>
            </div>
        </div>
    </div>

    <div class="footer">
        <div>This export contains all your FocusReads data as of ${formatDate(data.exportDate)}</div>
        <div>Generated by FocusReads - Your Personal Book Club</div>
        <div style="margin-top: 10px; font-size: 10px;">
            <strong>Data Compatibility:</strong> This PDF export can be used with the "Import My Data" feature to restore your complete reading profile.
        </div>
    </div>
</body>
</html>
    `;
  }

  static async exportToJSON(): Promise<void> {
    const data: ExportData = {
      books: JSON.parse(localStorage.getItem('focusreads-books') || '[]'),
      notes: JSON.parse(localStorage.getItem('focusreads-notes') || '[]'),
      preferences: JSON.parse(localStorage.getItem('focusreads-preferences') || '{}'),
      pomodoroSessions: JSON.parse(localStorage.getItem('focusreads-pomodoro-sessions') || '[]'),
      pomodoroTotal: localStorage.getItem('focusreads-pomodoro-total') || '0',
      settings: {
        theme: localStorage.getItem('focusreads-theme') || 'serenityBlue',
        dark: localStorage.getItem('focusreads-dark') || 'false',
        background: localStorage.getItem('focusreads-background') || ''
      },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusreads-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}