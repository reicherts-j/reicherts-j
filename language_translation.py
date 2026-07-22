from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS
from deep_translator import GoogleTranslator
import os

app = Flask(__name__, static_folder=os.getcwd(), static_url_path='')
CORS(app)

def translate_in_chunks(text, target_language, chunk_size=1000):
    """Translate text by splitting it into smaller chunks to avoid timeouts"""
    if not text or len(text) == 0:
        return text
    
    try:
        # First try to translate the whole text
        translator = GoogleTranslator(source='auto', target=target_language)
        return translator.translate(text)
    except Exception as e:
        print(f'Full translation failed, attempting chunked translation: {str(e)}')
        
        # If full translation fails, split by paragraphs and translate individually
        paragraphs = text.split('\n')
        translated_paragraphs = []
        
        for para in paragraphs:
            if not para.strip():
                translated_paragraphs.append(para)
                continue
            
            try:
                translator = GoogleTranslator(source='auto', target=target_language)
                translated = translator.translate(para)
                translated_paragraphs.append(translated)
                print(f'Translated paragraph ({len(para)} chars) to {target_language}')
            except Exception as para_error:
                print(f'Failed to translate paragraph: {str(para_error)}, keeping original')
                translated_paragraphs.append(para)
        
        return '\n'.join(translated_paragraphs)
 
@app.route('/')
def index():
    return send_from_directory(os.getcwd(), 'document.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.getcwd(), filename)

@app.route('/process-papers', methods=['POST'])
def process_papers():
    try:
        papers_data = request.get_json()
        
        if not papers_data:
            return jsonify({'error': 'No data received'}), 400
        
        processed_papers = []
        for paper in papers_data:
            processed_paper = {
                'category': paper.get('category', ''),
                'title': paper.get('title', ''),
                'content': paper.get('content', ''),
                'citations': paper.get('citations', ''),
                'processed': True
            }
            processed_papers.append(processed_paper)
        
        print(f'Processed {len(processed_papers)} papers')
        return jsonify(processed_papers), 200
    
    except Exception as e:
        print(f'Error: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/translate-papers', methods=['POST'])
def translate_papers():
    try:
        data = request.get_json()
        target_language = data.get('language', 'de')
        papers_data = data.get('papers', [])
        
        if not papers_data:
            return jsonify({'error': 'No papers data received'}), 400
        
        translated_papers = []
        for paper in papers_data:
            try:
                translated_title = translate_in_chunks(paper.get('title', ''), target_language)
                translated_content = translate_in_chunks(paper.get('content', ''), target_language)
                translated_citations = translate_in_chunks(paper.get('citations', ''), target_language) if paper.get('citations') else ''
                
                translated_paper = {
                    'category': paper.get('category', ''),
                    'title': translated_title,
                    'content': translated_content,
                    'citations': translated_citations,
                    'translated': True
                }
                translated_papers.append(translated_paper)
                print(f'Translated: {translated_title}')
            except Exception as e:
                print(f'Translation error for {paper.get("title", "Unknown")}: {str(e)}')
                translated_papers.append(paper)
        
        print(f'Translated {len(translated_papers)} papers to {target_language}')
        return jsonify(translated_papers), 200
    
    except Exception as e:
        print(f'Error: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/translate-paper', methods=['POST'])
def translate_paper():
    try:
        data = request.get_json()
        target_language = data.get('language', 'de')
        paper = data.get('paper', {})
        
        if not paper:
            return jsonify({'error': 'No paper data received'}), 400
        
        try:
            print(f'Translating paper "{paper.get("title", "Unknown")}" to {target_language}')
            
            translated_title = translate_in_chunks(paper.get('title', ''), target_language)
            
            translated_content = translate_in_chunks(paper.get('content', ''), target_language)
            
            translated_citations = translate_in_chunks(paper.get('citations', ''), target_language) if paper.get('citations') else ''
            
            translated_paper = {
                'category': paper.get('category', ''),
                'title': translated_title,
                'content': translated_content,
                'citations': translated_citations,
                'translated': True
            }
            print(f'Successfully translated paper "{translated_title}" to {target_language}')
            return jsonify(translated_paper), 200
        except Exception as e:
            print(f'Translation error for {paper.get("title", "Unknown")}: {str(e)}')
            return jsonify({'error': f'Translation failed: {str(e)}'}), 500
    
    except Exception as e:
        print(f'Error: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/translate-texts', methods=['POST'])
def translate_texts():
    try:
        data = request.get_json()
        target_language = data.get('language', 'de')
        texts = data.get('texts', [])
        
        if not texts:
            return jsonify({'error': 'No texts provided'}), 400
        
        translated_texts = []
        for text in texts:
            if not text or text.strip() == '':
                translated_texts.append(text)
                continue
            try:
                translated = translate_in_chunks(text, target_language)
                translated_texts.append(translated)
            except Exception as e:
                print(f'Failed to translate text "{text}": {str(e)}')
                translated_texts.append(text)
        
        print(f'Translated {len(translated_texts)} UI text elements to {target_language}')
        return jsonify({'texts': translated_texts}), 200
    
    except Exception as e:
        print(f'Error: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)