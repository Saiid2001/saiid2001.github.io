import * as React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const NewsRowPlaceholder: React.FC = () => {
    return (
        <div className="flex flex-row gap-4">
            <div className="w-1/6 h-12 bg-primary/10 rounded-lg"></div>
            <div className="w-5/6 h-12 bg-primary/10 rounded-lg"></div>
        </div>
    )
}


const LatestNews: React.FC = () => {

    return (
        <div className="bg-primary/10 w-full h-full p-8 max-h-100 flex flex-col">
            <h1 className="font-bold text-xl">Latest News</h1>
            <div className="grow flex flex-col gap-4 mt-4">
                <NewsRowPlaceholder />
                <NewsRowPlaceholder />
                <NewsRowPlaceholder />
            </div>
            <div className=" gap-2 grid grid-cols-3 justify-between">
                <a className="btn btn-secondary ">Blogs <FontAwesomeIcon icon={faArrowRight} /></a>
                <a className="btn btn-secondary ">Projects <FontAwesomeIcon icon={faArrowRight} /></a>
                <a className="btn btn-secondary ">Publications <FontAwesomeIcon icon={faArrowRight} /></a>
            </div>
        </div>
    )
    }

export default LatestNews