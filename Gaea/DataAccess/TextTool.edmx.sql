
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 05/04/2018 09:18:39
-- Generated from EDMX file: H:\tmp\TextToolPoc\TextToolPoc\DataAccess\TextTool.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [TextTool];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[FK_TemplateTemplateField]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[TemplateFields] DROP CONSTRAINT [FK_TemplateTemplateField];
GO
IF OBJECT_ID(N'[dbo].[FK_TemplateFieldFieldMatch]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[FieldMatches] DROP CONSTRAINT [FK_TemplateFieldFieldMatch];
GO
IF OBJECT_ID(N'[dbo].[FK_TemplateFieldFieldExpected]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[FieldExpecteds] DROP CONSTRAINT [FK_TemplateFieldFieldExpected];
GO
IF OBJECT_ID(N'[dbo].[FK_ArticleFieldMatch]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[FieldMatches] DROP CONSTRAINT [FK_ArticleFieldMatch];
GO
IF OBJECT_ID(N'[dbo].[FK_RuleFieldMatch]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[FieldMatches] DROP CONSTRAINT [FK_RuleFieldMatch];
GO
IF OBJECT_ID(N'[dbo].[FK_ProjectArticle]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[Articles] DROP CONSTRAINT [FK_ProjectArticle];
GO
IF OBJECT_ID(N'[dbo].[FK_ArticleFieldExpected]', 'F') IS NOT NULL
    ALTER TABLE [dbo].[FieldExpecteds] DROP CONSTRAINT [FK_ArticleFieldExpected];
GO

-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[Templates]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Templates];
GO
IF OBJECT_ID(N'[dbo].[TemplateFields]', 'U') IS NOT NULL
    DROP TABLE [dbo].[TemplateFields];
GO
IF OBJECT_ID(N'[dbo].[FieldMatches]', 'U') IS NOT NULL
    DROP TABLE [dbo].[FieldMatches];
GO
IF OBJECT_ID(N'[dbo].[Projects]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Projects];
GO
IF OBJECT_ID(N'[dbo].[Articles]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Articles];
GO
IF OBJECT_ID(N'[dbo].[Pretreatments]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Pretreatments];
GO
IF OBJECT_ID(N'[dbo].[Rules]', 'U') IS NOT NULL
    DROP TABLE [dbo].[Rules];
GO
IF OBJECT_ID(N'[dbo].[FieldExpecteds]', 'U') IS NOT NULL
    DROP TABLE [dbo].[FieldExpecteds];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'Templates'
CREATE TABLE [dbo].[Templates] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [TemplateName] nvarchar(max)  NULL
);
GO

-- Creating table 'TemplateFields'
CREATE TABLE [dbo].[TemplateFields] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [FieldName] nvarchar(max)  NULL,
    [TemplateTemplateField_TemplateField_Id] int  NOT NULL
);
GO

-- Creating table 'FieldMatches'
CREATE TABLE [dbo].[FieldMatches] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [MatchText] nvarchar(max)  NULL,
    [MatchScore] int  NULL,
    [TemplateFieldFieldMatch_FieldMatch_Id] int  NOT NULL,
    [Article_Id] int  NOT NULL,
    [Rule_Id] int  NOT NULL
);
GO

-- Creating table 'Projects'
CREATE TABLE [dbo].[Projects] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [ProjectName] nvarchar(max)  NULL
);
GO

-- Creating table 'Articles'
CREATE TABLE [dbo].[Articles] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [FileName] nvarchar(max)  NULL,
    [OriginalContent] nvarchar(max)  NULL,
    [Runned] bit  NULL,
    [ProjectArticle_Article_Id] int  NOT NULL
);
GO

-- Creating table 'Pretreatments'
CREATE TABLE [dbo].[Pretreatments] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Name] nvarchar(max)  NULL,
    [Expression] nvarchar(max)  NULL,
    [ReplaceTo] nvarchar(max)  NULL,
    [Order] int  NOT NULL
);
GO

-- Creating table 'Rules'
CREATE TABLE [dbo].[Rules] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [RuleName] nvarchar(max)  NULL,
    [RuleType] nvarchar(max)  NULL,
    [Content] nvarchar(max)  NULL
);
GO

-- Creating table 'FieldExpecteds'
CREATE TABLE [dbo].[FieldExpecteds] (
    [Id] int IDENTITY(1,1) NOT NULL,
    [Value] nvarchar(max)  NULL,
    [TemplateFieldFieldExpected_FieldExpected_Id] int  NOT NULL,
    [Article_Id] int  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [Id] in table 'Templates'
ALTER TABLE [dbo].[Templates]
ADD CONSTRAINT [PK_Templates]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'TemplateFields'
ALTER TABLE [dbo].[TemplateFields]
ADD CONSTRAINT [PK_TemplateFields]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'FieldMatches'
ALTER TABLE [dbo].[FieldMatches]
ADD CONSTRAINT [PK_FieldMatches]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Projects'
ALTER TABLE [dbo].[Projects]
ADD CONSTRAINT [PK_Projects]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Articles'
ALTER TABLE [dbo].[Articles]
ADD CONSTRAINT [PK_Articles]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Pretreatments'
ALTER TABLE [dbo].[Pretreatments]
ADD CONSTRAINT [PK_Pretreatments]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'Rules'
ALTER TABLE [dbo].[Rules]
ADD CONSTRAINT [PK_Rules]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- Creating primary key on [Id] in table 'FieldExpecteds'
ALTER TABLE [dbo].[FieldExpecteds]
ADD CONSTRAINT [PK_FieldExpecteds]
    PRIMARY KEY CLUSTERED ([Id] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- Creating foreign key on [TemplateTemplateField_TemplateField_Id] in table 'TemplateFields'
ALTER TABLE [dbo].[TemplateFields]
ADD CONSTRAINT [FK_TemplateTemplateField]
    FOREIGN KEY ([TemplateTemplateField_TemplateField_Id])
    REFERENCES [dbo].[Templates]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_TemplateTemplateField'
CREATE INDEX [IX_FK_TemplateTemplateField]
ON [dbo].[TemplateFields]
    ([TemplateTemplateField_TemplateField_Id]);
GO

-- Creating foreign key on [TemplateFieldFieldMatch_FieldMatch_Id] in table 'FieldMatches'
ALTER TABLE [dbo].[FieldMatches]
ADD CONSTRAINT [FK_TemplateFieldFieldMatch]
    FOREIGN KEY ([TemplateFieldFieldMatch_FieldMatch_Id])
    REFERENCES [dbo].[TemplateFields]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_TemplateFieldFieldMatch'
CREATE INDEX [IX_FK_TemplateFieldFieldMatch]
ON [dbo].[FieldMatches]
    ([TemplateFieldFieldMatch_FieldMatch_Id]);
GO

-- Creating foreign key on [TemplateFieldFieldExpected_FieldExpected_Id] in table 'FieldExpecteds'
ALTER TABLE [dbo].[FieldExpecteds]
ADD CONSTRAINT [FK_TemplateFieldFieldExpected]
    FOREIGN KEY ([TemplateFieldFieldExpected_FieldExpected_Id])
    REFERENCES [dbo].[TemplateFields]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_TemplateFieldFieldExpected'
CREATE INDEX [IX_FK_TemplateFieldFieldExpected]
ON [dbo].[FieldExpecteds]
    ([TemplateFieldFieldExpected_FieldExpected_Id]);
GO

-- Creating foreign key on [Article_Id] in table 'FieldMatches'
ALTER TABLE [dbo].[FieldMatches]
ADD CONSTRAINT [FK_ArticleFieldMatch]
    FOREIGN KEY ([Article_Id])
    REFERENCES [dbo].[Articles]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ArticleFieldMatch'
CREATE INDEX [IX_FK_ArticleFieldMatch]
ON [dbo].[FieldMatches]
    ([Article_Id]);
GO

-- Creating foreign key on [Rule_Id] in table 'FieldMatches'
ALTER TABLE [dbo].[FieldMatches]
ADD CONSTRAINT [FK_RuleFieldMatch]
    FOREIGN KEY ([Rule_Id])
    REFERENCES [dbo].[Rules]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_RuleFieldMatch'
CREATE INDEX [IX_FK_RuleFieldMatch]
ON [dbo].[FieldMatches]
    ([Rule_Id]);
GO

-- Creating foreign key on [ProjectArticle_Article_Id] in table 'Articles'
ALTER TABLE [dbo].[Articles]
ADD CONSTRAINT [FK_ProjectArticle]
    FOREIGN KEY ([ProjectArticle_Article_Id])
    REFERENCES [dbo].[Projects]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ProjectArticle'
CREATE INDEX [IX_FK_ProjectArticle]
ON [dbo].[Articles]
    ([ProjectArticle_Article_Id]);
GO

-- Creating foreign key on [Article_Id] in table 'FieldExpecteds'
ALTER TABLE [dbo].[FieldExpecteds]
ADD CONSTRAINT [FK_ArticleFieldExpected]
    FOREIGN KEY ([Article_Id])
    REFERENCES [dbo].[Articles]
        ([Id])
    ON DELETE NO ACTION ON UPDATE NO ACTION;
GO

-- Creating non-clustered index for FOREIGN KEY 'FK_ArticleFieldExpected'
CREATE INDEX [IX_FK_ArticleFieldExpected]
ON [dbo].[FieldExpecteds]
    ([Article_Id]);
GO

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------