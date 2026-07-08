# MASTER PROMPT

You are an expert Software Architect, Senior Full Stack Developer, and UI/UX Engineer.

Your task is to build a complete production-ready web application named:

# OpenAccess Paper Finder

The project must be fully functional, cleanly structured, scalable, documented, and ready to run inside GitHub Codespaces.

Never generate pseudo code.

Generate every file completely.

Never omit code.

Always indicate the file path before generating each file.

---

# Main Goal

Build a web application that allows researchers to search scholarly articles from OpenAlex using either:

* DOI
* Paper Title

The application should retrieve article metadata, determine whether the article is Open Access, and display all useful information in a modern interface.

Use only the official OpenAlex REST API.

---

# Technology Stack

Frontend

* React 19 (Vite)
* TailwindCSS
* Axios
* React Router
* React Icons

Backend

* Node.js
* Express
* Axios
* dotenv
* cors

Module System

* ES Modules only

Package Manager

npm

Database

None

---

# Folder Structure

paper-search/

client/

src/

components/

pages/

services/

hooks/

utils/

assets/

App.jsx

main.jsx

server/

controllers/

routes/

services/

utils/

middleware/

app.js

.env.example

README.md

---

# API

Base URL

https://api.openalex.org

Search by title

GET /works?search={keyword}

Search by DOI

GET /works/doi:{doi}

---

# Backend

Create REST API

GET

/api/search?q=

Workflow

Receive query

↓

Trim spaces

↓

Detect DOI

↓

If DOI

Call

GET /works/doi:{doi}

Else

Call

GET /works?search={keyword}

↓

Normalize response

↓

Return JSON

---

# Normalize JSON

Return

title

authors

journal

year

doi

abstract

citationCount

isOpenAccess

pdfUrl

landingPage

publisher

language

type

topics

keywords

license

---

# Frontend

Create pages

Home

About

Search Result

404

---

# Components

Navbar

Footer

SearchBar

Loading

PaperCard

PaperList

Badge

ErrorMessage

Pagination

EmptyState

---

# Home Page

Centered search box

Placeholder

"Enter DOI or Paper Title"

Large Search button

Beautiful responsive design

---

# Search Logic

If text begins with

10.

Treat as DOI

Else

Treat as title

---

# Paper Card

Display

Title

Authors

Journal

Publication Year

DOI

Citation Count

Publisher

Language

Open Access Badge

Abstract

PDF Button

Publisher Button

Copy DOI Button

Copy APA Citation Button

---

# Extra Features

Dark Mode

Responsive Design

Loading Spinner

Toast Notification

Search History using LocalStorage

Clear History

Recent Searches

Copy to Clipboard

Open PDF in new tab

---

# Error Handling

Invalid DOI

No Result

API Error

Timeout

Network Error

404

500

---

# UI

Modern

Minimal

Rounded Cards

Shadow

Hover Animation

Smooth Transition

Responsive

Mobile Friendly

Professional Research Style

---

# Backend Service

Create OpenAlexService.js

Functions

searchByDOI()

searchByTitle()

normalizePaper()

extractAuthors()

extractJournal()

extractPDF()

extractAbstract()

---

# Utility

Create

isDOI()

formatAuthors()

formatAPA()

copyToClipboard()

---

# Environment

Create

.env.example

OPENALEX_API_KEY=

PORT=5000

---

# Commands

Generate commands for

npm install

npm run dev

npm run server

npm run build

---

# README

Write complete README including

Installation

Configuration

Run

Folder Structure

Screenshots Placeholder

API Example

License

---

# Code Quality

Use async/await

No duplicated code

Reusable functions

Component-based architecture

Proper error handling

Meaningful variable names

Clean comments

Production-ready

---

# Testing

After generating all files

Review the project

Check imports

Check exports

Check routing

Check API

Check React rendering

Check backend endpoints

Fix every detected issue automatically

---

# Final Output

Generate the project step by step.

Never skip steps.

Generate every file completely.

Do not summarize.

Do not stop until the whole project is finished.

If the response exceeds the token limit, automatically continue from the previous file until the entire project is complete.
