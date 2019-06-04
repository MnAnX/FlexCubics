import _ from 'lodash';
import jsPDF from 'jspdf'

export const generatePdf = (fileName, content) => {
	// pdf properties
	var pageWidth = 8.5,
			lineHeight = 1,
			margin = 0.5,
			maxLineWidth = pageWidth - margin * 2,
			fontSize = 14,
			ptsPerInch = 72,
			oneLineHeight = fontSize * lineHeight / ptsPerInch;
	let doc = new jsPDF({
		unit: 'in',
		lineHeight
	});
	// split content into lines that fit into page width
	let textLines = doc
		.setFontSize(fontSize)
		.splitTextToSize(content, maxLineWidth);
	// split text lines by page
	let pageHeight = doc.internal.pageSize.height;
	let numLinesPerPage = pageHeight / oneLineHeight - 8;  // minus N lines to make sure space at bottom
	let textChunks = _.chunk(textLines, numLinesPerPage);
	// add text chunks to pages
	doc.text(textChunks[0], margin, margin + 2 * oneLineHeight);
	// continue on the following pages
	for(var i = 1 ; i < textChunks.length; i++) {
		doc.addPage()
		doc.text(textChunks[i], margin, margin + 2 * oneLineHeight);
	}
	// save pdf
	doc.save(fileName)
};
