// Static dummy data used across the AutoNote AI frontend.
// TODO: Replace with API responses once the backend is connected.

export const dashboardStats = [
  { id: 1, label: 'Total Lectures',      value: 24,  trend: '+12%', icon: 'Mic' },
  { id: 2, label: 'Notes Generated',     value: 87,  trend: '+18%', icon: 'FileText' },
  { id: 3, label: 'Flashcards Created',  value: 312, trend: '+24%', icon: 'Layers' },
  { id: 4, label: 'Quizzes Generated',   value: 46,  trend: '+9%',  icon: 'HelpCircle' },
]

export const processingSteps = [
  { id: 1, title: 'Upload Lecture',           description: 'Drop your audio or video file',                icon: 'Upload' },
  { id: 2, title: 'Speech-to-Text',           description: 'High-accuracy transcription with Whisper',     icon: 'Mic' },
  { id: 3, title: 'AI Summarisation',         description: 'GPT-powered topic extraction & summaries',     icon: 'Sparkles' },
  { id: 4, title: 'Topic-wise Notes',         description: 'Structured, classroom-ready notes',            icon: 'FileText' },
  { id: 5, title: 'Flashcards & Quizzes',     description: 'Active-recall study material instantly',       icon: 'Layers' },
]

export const generatedNotes = [
  {
    id: 1,
    topic: 'Introduction to Neural Networks',
    points: [
      'Inspired by the structure of the human brain — neurons connected via weighted edges.',
      'Composed of an input layer, one or more hidden layers, and an output layer.',
      'Learn by adjusting weights using backpropagation and gradient descent.',
    ],
    definitions: [
      { term: 'Perceptron',      meaning: 'The simplest type of artificial neuron, computing a weighted sum followed by an activation.' },
      { term: 'Activation Func', meaning: 'A non-linear function (ReLU, Sigmoid, Tanh) that introduces non-linearity to the network.' },
    ],
    formulas: ['y = f(Σ wᵢxᵢ + b)', 'L = -Σ yᵢ log(ŷᵢ)'],
  },
  {
    id: 2,
    topic: 'Backpropagation',
    points: [
      'A chain-rule based algorithm for efficiently computing gradients in deep networks.',
      'Errors are propagated backward from the output layer to update weights.',
      'Combined with optimisers like SGD, Adam, or RMSProp during training.',
    ],
    definitions: [
      { term: 'Gradient Descent', meaning: 'An optimisation algorithm that minimises a loss function by following the negative gradient.' },
      { term: 'Learning Rate',    meaning: 'A hyperparameter that controls how much weights change per update step.' },
    ],
    formulas: ['w := w − η · ∂L/∂w'],
  },
  {
    id: 3,
    topic: 'Convolutional Neural Networks',
    points: [
      'CNNs apply learnable filters across spatial dimensions of an image.',
      'Pooling layers reduce dimensionality while keeping the most important features.',
      'Widely used for image classification, object detection, and segmentation.',
    ],
    definitions: [
      { term: 'Convolution', meaning: 'Element-wise multiplication of a filter sliding across the input followed by a sum.' },
      { term: 'Pooling',     meaning: 'A down-sampling operation (max or average) that reduces spatial size.' },
    ],
    formulas: ['(f * g)(t) = Σ f(τ) g(t − τ)'],
  },
]

export const summaryData = {
  short: 'This lecture introduces neural networks, explains how they learn through backpropagation, and dives into convolutional architectures used for visual tasks.',
  detailed: `Neural networks are a class of machine-learning models loosely inspired by biological neurons. The lecture begins by motivating why deep models outperform shallow classifiers on high-dimensional data such as images and audio. The professor walks through the perceptron, multi-layer perceptrons, and the role of non-linear activation functions like ReLU.

The second half of the session focuses on training. Loss functions (cross-entropy, MSE) are introduced, followed by a derivation of backpropagation as an application of the chain rule. Optimisers — SGD, Momentum, and Adam — are compared with a note on hyperparameter sensitivity.

Finally, convolutional neural networks are introduced as a specialised architecture for images. Convolution, padding, stride, and pooling are walked through with worked examples, ending with a brief overview of modern architectures (ResNet, EfficientNet).`,
  takeaways: [
    'Neural networks learn hierarchical representations from data.',
    'Backpropagation + gradient descent is the workhorse of deep learning training.',
    'CNNs leverage spatial locality via convolutions and weight sharing.',
    'Choice of optimiser and learning rate has large impact on convergence.',
    'Modern architectures rely on residual connections for very deep networks.',
  ],
}

export const flashcards = [
  { id: 1, question: 'What is a perceptron?',                          answer: 'A single artificial neuron that outputs an activation of a weighted sum of inputs plus a bias.' },
  { id: 2, question: 'Why do we need non-linear activation functions?', answer: 'Without them, a deep network collapses into an equivalent linear model and cannot learn complex patterns.' },
  { id: 3, question: 'State the gradient descent update rule.',         answer: 'w := w − η · ∂L/∂w, where η is the learning rate.' },
  { id: 4, question: 'What is backpropagation?',                        answer: 'An algorithm that uses the chain rule to compute gradients of the loss with respect to every weight.' },
  { id: 5, question: 'What does a pooling layer do?',                   answer: 'It down-samples feature maps, keeping the most important values and reducing computation.' },
  { id: 6, question: 'Why use ReLU over Sigmoid?',                      answer: 'ReLU avoids vanishing gradients for positive inputs and is computationally cheaper.' },
]

export const quizQuestions = [
  {
    id: 1,
    question: 'Which function is most commonly used as an activation in modern deep networks?',
    options: ['Sigmoid', 'Tanh', 'ReLU', 'Step function'],
    answerIndex: 2,
  },
  {
    id: 2,
    question: 'Backpropagation primarily relies on which mathematical rule?',
    options: ['Product rule', 'Chain rule', 'Quotient rule', 'L\'Hôpital\'s rule'],
    answerIndex: 1,
  },
  {
    id: 3,
    question: 'What does a convolution operation help capture?',
    options: ['Global colour histograms', 'Spatial/local patterns', 'Audio frequency only', 'Text embeddings'],
    answerIndex: 1,
  },
  {
    id: 4,
    question: 'Which optimiser uses adaptive per-parameter learning rates and momentum?',
    options: ['Vanilla SGD', 'Adam', 'Newton\'s Method', 'Genetic Algorithm'],
    answerIndex: 1,
  },
  {
    id: 5,
    question: 'A pooling layer is mainly used to…',
    options: ['Increase resolution', 'Add non-linearity', 'Reduce spatial dimensions', 'Replace convolution entirely'],
    answerIndex: 2,
  },
]

export const lectureHistory = [
  { id: 1, title: 'Introduction to Neural Networks', subject: 'Deep Learning',         date: '2026-04-28', duration: '52 min', status: 'processed' },
  { id: 2, title: 'Backpropagation Deep Dive',       subject: 'Deep Learning',         date: '2026-04-22', duration: '47 min', status: 'processed' },
  { id: 3, title: 'CNN Architectures',               subject: 'Computer Vision',       date: '2026-04-15', duration: '61 min', status: 'processed' },
  { id: 4, title: 'Recurrent Networks & LSTMs',      subject: 'Deep Learning',         date: '2026-04-10', duration: '58 min', status: 'processed' },
  { id: 5, title: 'Transformers Explained',          subject: 'NLP',                   date: '2026-04-04', duration: '70 min', status: 'pending'   },
  { id: 6, title: 'Probability for ML',              subject: 'Mathematics for ML',    date: '2026-03-30', duration: '44 min', status: 'processed' },
  { id: 7, title: 'Reinforcement Learning Basics',   subject: 'RL',                    date: '2026-03-22', duration: '55 min', status: 'pending'   },
]

export const userProfile = {
  name:     'Suraaj Gibs',
  email:    'tech@rastaa.ai',
  branch:   'Computer Science',
  semester: '6th Semester',
  college:  'University of Technology',
  avatar:   'SG',
}
