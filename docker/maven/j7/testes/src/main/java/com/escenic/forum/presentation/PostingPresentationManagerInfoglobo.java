package com.escenic.forum.presentation;

import static java.lang.String.format;
import neo.xredsys.api.IllegalOperationException;

import org.apache.log4j.Logger;

import com.escenic.forum.Posting;

public class PostingPresentationManagerInfoglobo extends PostingPresentationManager {

	private PresentationManager presentationManager;

	private boolean enableCorrectionOfBlankComment;

	private static final Logger LOG = Logger.getLogger(PostingPresentationManagerInfoglobo.class);

	@Override
	protected Object createNewObject(int id) {

		if (enableCorrectionOfBlankComment) {

			PresentationPostingImpl presentationPosting = null;

			try {
				presentationPosting = getPresentationPosting(id, false);

				if (presentationPosting == null) {

					presentationPosting = getPresentationPosting(id, true);
				}

			} catch (Exception e) {

				LOG.error("Error occured when creating a presentationposting with id " + id, e);
			}

			return presentationPosting;
		}

		return super.createNewObject(id);

	}

	@SuppressWarnings("unchecked")
    private PresentationPostingImpl getPresentationPosting(int id, boolean expireCache) throws IllegalOperationException {

		Posting posting = getForumManager().getPosting(id);

		if (expireCache) {

			presentationManager.getForumManager().getCache().expireObject(posting.getHashKey());
			posting = getForumManager().getPosting(id);
		}

		if (LOG.isDebugEnabled()) {

			LOG.debug(format("Criando novo comentario [%s]", posting.getId()));
			LOG.debug(format("Publicado? [%s]", posting.isPublished()));
			LOG.debug(format("Id do Forum [%s]", posting.getForumId()));
			LOG.debug(format("Forum publicado? [%s]", posting.getForum().isPublished()));
		}

		if (posting.isPublished() && posting.getForum().isPublished()) {

			return new PresentationPostingImpl(posting, presentationManager);
		}

		return null;
	}

	public void setPresentationManager(PresentationManager presentationManager) {

		this.presentationManager = presentationManager;
	}

	public boolean isEnableCorrectionOfBlankComment() {

		return enableCorrectionOfBlankComment;
	}

	public void setEnableCorrectionOfBlankComment(boolean enableCorrectionOfBlankComment) {

		this.enableCorrectionOfBlankComment = enableCorrectionOfBlankComment;
	}

}
