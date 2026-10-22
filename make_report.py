from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem, KeepTogether
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from pathlib import Path

base = Path(__file__).parent
out = base / 'docs' / 'Project-Report.pdf'
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='ReportTitle', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=19, leading=22, textColor=colors.HexColor('#6040bf'), alignment=TA_CENTER, spaceAfter=5))
styles.add(ParagraphStyle(name='Subtitle', parent=styles['Normal'], fontSize=8.5, leading=11, textColor=colors.HexColor('#66627c'), alignment=TA_CENTER, spaceAfter=12))
styles.add(ParagraphStyle(name='SectionHead', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=11, leading=13, textColor=colors.HexColor('#292441'), spaceBefore=7, spaceAfter=3, keepWithNext=True))
styles.add(ParagraphStyle(name='BodySmall', parent=styles['BodyText'], fontName='Helvetica', fontSize=8.5, leading=11.2, spaceAfter=4))
styles.add(ParagraphStyle(name='BulletSmall', parent=styles['BodyText'], fontName='Helvetica', fontSize=8.2, leading=10.5, leftIndent=12, firstLineIndent=-7, spaceAfter=2))
styles.add(ParagraphStyle(name='NoteSmall', parent=styles['BodyText'], fontSize=8, leading=10, textColor=colors.HexColor('#5f5b74'), backColor=colors.HexColor('#f4f0ff'), borderPadding=6, spaceBefore=4, spaceAfter=5))

doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=17*mm, leftMargin=17*mm, topMargin=13*mm, bottomMargin=13*mm, title='CampusHub Project Report', author='CampusHub Mini Project')
story=[]
story.append(Paragraph('CampusHub — Student Planner', styles['ReportTitle']))
story.append(Paragraph('FLEXI CREDIT COURSE  |  CONTINUOUS ASSESSMENT 2 — MINI PROJECT  |  BATCH 2025–29  |  SEMESTER III', styles['Subtitle']))
story.append(Paragraph('1. Motivation for Selection of the Topic', styles['SectionHead']))
story.append(Paragraph('Students often track assignments, practicals, tests, and study tasks across separate notebooks and messages. Important deadlines can be missed when information is scattered. CampusHub provides one simple workspace to capture tasks, identify priorities, and review progress. The topic was selected because it addresses a familiar student problem and demonstrates the course technologies in a useful, interactive application.', styles['BodySmall']))
story.append(Paragraph('2. Objectives of the Project', styles['SectionHead']))
objectives=[
'Build a responsive, easy-to-use student task planner.',
'Use semantic HTML for page structure and forms, and external CSS for consistent styling and responsive layout.',
'Use JavaScript for form events, filtering, searching, sorting, validation feedback, and asynchronous API calls.',
'Use Node.js to serve the website and provide a JSON API to create, read, update, and delete tasks.',
'Save tasks persistently in a local JSON file so changes survive a browser refresh.',
'Demonstrate an end-to-end client–server workflow and basic input validation.'
]
story.append(ListFlowable([ListItem(Paragraph(x,styles['BulletSmall']), bulletColor=colors.HexColor('#7856d9')) for x in objectives], bulletType='bullet', start='circle', leftIndent=12, bulletFontSize=6, spaceAfter=3))
story.append(Paragraph('3. Customer Base / Target Users', styles['SectionHead']))
story.append(Paragraph('The primary users are college and university students who want to organise assignments, lab work, quizzes, project milestones, and study tasks. Individual learners or student teams can also use it as a lightweight deadline tracker. This is a local coursework prototype, not a multi-user production service.', styles['BodySmall']))
story.append(Paragraph('4. Summary of the Project', styles['SectionHead']))
story.append(Paragraph('CampusHub is a responsive web application with task creation, editing, completion toggling, deletion, text search, due-date/priority/name sorting, and All/In Progress/Completed filters. The dashboard displays total, active, and completed task counts. Each task stores a title, course/subject, optional due date, priority, completion state, and creation timestamp.', styles['BodySmall']))
story.append(Paragraph('<b>Implementation:</b> <font name="Helvetica-Bold">public/index.html</font> defines the page, accessible controls, and task form. <font name="Helvetica-Bold">public/styles.css</font> provides external styles, selectors, box-model spacing, Flexbox/Grid layout, hover states, and responsive media queries. <font name="Helvetica-Bold">public/app.js</font> uses DOM events and <font name="Courier">fetch()</font> to call the backend and render tasks. <font name="Helvetica-Bold">server.js</font> uses Node.js built-in <font name="Courier">http</font>, <font name="Courier">fs</font>, <font name="Courier">path</font>, and <font name="Courier">url</font> modules to serve static files and provide JSON API endpoints. Data is persisted in <font name="Helvetica-Bold">data/tasks.json</font>. No third-party npm package or database is required.', styles['BodySmall']))
story.append(Paragraph('<b>Prerequisites and execution:</b> Node.js 18 or later (Node.js 20/22 LTS recommended), a modern browser, and optionally Visual Studio Code. Internet is optional; if Google Fonts are unavailable, local fonts are used. In the project folder run <font name="Courier">npm start</font>, then open <font name="Courier">http://127.0.0.1:3000</font>. The README contains full setup, API routes, testing checklist, troubleshooting, and project structure.', styles['BodySmall']))
story.append(Paragraph('5. Git Repository Link', styles['SectionHead']))
story.append(Paragraph('GitHub repository: <b>Not published yet.</b> After creating a GitHub repository and pushing this project, replace this line with the actual repository URL. Publishing instructions are provided in README.md. Do not submit a placeholder as if it were a live repository.', styles['NoteSmall']))
story.append(Paragraph('6. Conclusion', styles['SectionHead']))
story.append(Paragraph('CampusHub demonstrates how HTML, CSS, browser-side JavaScript, and Node.js work together to create a complete small web application. It provides useful task-management interactions, validates user input, stores data persistently, and separates presentation from server logic. Future improvements could include user accounts, reminders, cloud storage, and a database.', styles['BodySmall']))

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#e7e2f3'))
    canvas.line(17*mm, 10*mm, A4[0]-17*mm, 10*mm)
    canvas.setFont('Helvetica', 7)
    canvas.setFillColor(colors.HexColor('#89859c'))
    canvas.drawString(17*mm, 6*mm, 'CampusHub | Flexi Credit Mini Project')
    canvas.drawRightString(A4[0]-17*mm, 6*mm, f'Page {doc.page}')
    canvas.restoreState()

doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(out)
