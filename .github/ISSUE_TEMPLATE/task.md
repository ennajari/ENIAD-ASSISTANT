name: Task
description: Technical task, refactoring, or maintenance item
title: '[TASK] '
labels: ['task']
assignees: ''

body:
  - type: textarea
    id: task-description
    attributes:
      label: Task Summary
      description: Detailed breakdown of the technical task or maintenance required.
    validations:
      required: true
