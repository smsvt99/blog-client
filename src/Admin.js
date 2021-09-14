import A from './A';
import {Switch, Route, withRouter, useRouteMatch, Redirect, Link} from 'react-router-dom';
import PostEdit from './PostEdit';
import PostManager from './PostManager';

function Admin(){

    const opts = {
        NEWPOST: 'new_post',
        MANAGE_POSTS: 'manage_posts',
        MANAGE_TAGS: 'manage_tags',
        MANAGE_USERS: 'manage_users',
        MANAGE_COMMENTS: 'manage_comments'
    }

    const match = useRouteMatch();

    return <div id="admin">
        <h1>Admin Dashboard</h1>
        <hr/>
        <div id="wrapper">
            <ul>
                <MenuItem option={opts.NEWPOST} current={match.params.option}>
                    <A>Write New Post</A>
                </MenuItem>

                <MenuItem option={opts.MANAGE_POSTS} current={match.params.option}>
                    <A>Manage Posts</A>
                </MenuItem>

                <MenuItem option={opts.MANAGE_TAGS} current={match.params.option}>
                    <A>Manage Tags</A>
                </MenuItem>

                <MenuItem option={opts.MANAGE_USERS} current={match.params.option}>
                    <A>Manage Users</A>
                </MenuItem>

                <MenuItem option={opts.MANAGE_COMMENTS} current={match.params.option}>
                    <A>Manage Comments</A>
                </MenuItem>            
            </ul>
            
            <div id="right">
                <Switch>
                    <Route path={`${match.path}/${opts.NEWPOST}`}>
                        <PostEdit _id={null}/>
                    </Route>

                    <Route path={`${match.path}/${opts.MANAGE_POSTS}`}>
                        <PostManager />
                    </Route>

                    <Route path={`${match.path}/${opts.MANAGE_TAGS}`}>
                        <p>manage tags</p>
                    </Route>

                    <Route path={`${match.path}/${opts.MANAGE_USERS}`}>
                        <p>manage users</p>
                    </Route>

                    <Route path={`${match.path}/${opts.MANAGE_COMMENTS}`}>
                        <p>manage comments</p>
                    </Route>

                    <Route>
                        <Redirect to={`${match.path}/${opts.NEWPOST}`}/>
                    </Route>
                </Switch>
            </div>
        
        </div>
    </div>
}

export default withRouter(Admin);

function MenuItem(props){

    const isCurrent = props.option === props.current;
    const classes = isCurrent ? "menu-item current" : "menu-item"

    return <Link to={`/admin/${props.option}`}>
            <li
                // comments
                className={classes}>
                {props.children}
            </li>
        </Link>
}